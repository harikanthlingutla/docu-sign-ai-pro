from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from app.models import APIResponse
from app.routers.auth import get_current_user
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import stripe
import os
from dotenv import load_dotenv
import json

load_dotenv()

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

router = APIRouter(tags=["Billing"])

class CheckoutSessionRequest(BaseModel):
    plan_id: str
    success_url: str
    cancel_url: str

class PayAsYouGoRequest(BaseModel):
    success_url: str
    cancel_url: str

# Plan ID mapping
PLAN_PRICES = {
    "creator": os.getenv("STRIPE_CREATOR_PRICE_ID"),
    "pro": os.getenv("STRIPE_PRO_PRICE_ID"),
    "premium": os.getenv("STRIPE_PREMIUM_PRICE_ID"),
    "payg": os.getenv("STRIPE_PAYG_PRICE_ID"),
}

# Plan details mapping
PLAN_DETAILS = {
    "creator": {"name": "Creator Plan", "document_limit": 10},
    "pro": {"name": "Pro Plan", "document_limit": 100},
    "premium": {"name": "Premium Plan", "document_limit": 250},
    "payg": {"name": "Pay As You Go", "document_limit": 1},
}

@router.post("/create-checkout-session", response_model=APIResponse)
async def create_checkout_session(
    request: CheckoutSessionRequest,
    user_id: str = Depends(get_current_user)
):
    """
    Create a Stripe Checkout Session for subscription plans.
    """
    try:
        if request.plan_id not in PLAN_PRICES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid plan ID. Available plans: {', '.join(PLAN_PRICES.keys())}"
            )
            
        price_id = PLAN_PRICES[request.plan_id]
        
        # Create checkout session
        checkout_session = stripe.checkout.Session.create(
            customer_email=user_id,  # In a real app, get the user's email
            payment_method_types=["card"],
            line_items=[{
                "price": price_id,
                "quantity": 1,
            }],
            mode="subscription",
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            metadata={"user_id": user_id, "plan_id": request.plan_id}
        )
        
        return APIResponse(
            status="success",
            data={"checkout_url": checkout_session.url},
            message="Checkout session created successfully"
        )
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create checkout session: {str(e)}"
        )

@router.post("/create-payg-session", response_model=APIResponse)
async def create_payg_session(
    request: PayAsYouGoRequest,
    user_id: str = Depends(get_current_user)
):
    """
    Create a Stripe Checkout Session for pay-as-you-go document.
    """
    try:
        price_id = PLAN_PRICES["payg"]
        
        # Create checkout session
        checkout_session = stripe.checkout.Session.create(
            customer_email=user_id,  # In a real app, get the user's email
            payment_method_types=["card"],
            line_items=[{
                "price": price_id,
                "quantity": 1,
            }],
            mode="payment",
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            metadata={"user_id": user_id, "plan_id": "payg"}
        )
        
        return APIResponse(
            status="success",
            data={"checkout_url": checkout_session.url},
            message="Pay-as-you-go checkout session created successfully"
        )
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create pay-as-you-go session: {str(e)}"
        )

async def handle_subscription_created(event_data: Dict[str, Any]):
    """Background task to handle subscription.created event"""
    subscription = event_data["object"]
    customer_id = subscription["customer"]
    subscription_id = subscription["id"]
    metadata = event_data.get("metadata", {})
    user_id = metadata.get("user_id")
    plan_id = metadata.get("plan_id")
    
    if not user_id or not plan_id:
        print(f"Missing user_id or plan_id in metadata for subscription {subscription_id}")
        return
    
    # Update user's subscription in database
    # In a real implementation, call supabase_service to update the subscription
    print(f"User {user_id} subscribed to {plan_id} plan with subscription ID {subscription_id}")

async def handle_payment_succeeded(event_data: Dict[str, Any]):
    """Background task to handle payment_intent.succeeded event"""
    payment_intent = event_data["object"]
    metadata = payment_intent.get("metadata", {})
    user_id = metadata.get("user_id")
    plan_id = metadata.get("plan_id")
    
    if not user_id:
        print(f"Missing user_id in metadata for payment {payment_intent['id']}")
        return
    
    if plan_id == "payg":
        # Add one document credit to the user
        # In a real implementation, call supabase_service to update document credits
        print(f"Added 1 document credit for user {user_id}")

@router.post("/stripe-webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Handle Stripe webhook events for subscription updates.
    """
    try:
        # Get the signature from the header
        signature = request.headers.get("stripe-signature")
        
        # Get the webhook data
        payload = await request.body()
        
        try:
            # Verify the event with Stripe
            event = stripe.Webhook.construct_event(
                payload, signature, webhook_secret
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid payload"
            )
        except stripe.error.SignatureVerificationError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid signature"
            )
        
        # Handle the event
        event_type = event["type"]
        event_data = event["data"]
        
        if event_type == "checkout.session.completed":
            session = event_data["object"]
            mode = session.get("mode")
            
            if mode == "subscription":
                # Subscription was created
                background_tasks.add_task(handle_subscription_created, event_data)
            elif mode == "payment":
                # One-time payment succeeded
                background_tasks.add_task(handle_payment_succeeded, event_data)
        
        elif event_type == "payment_intent.succeeded":
            # Payment succeeded
            background_tasks.add_task(handle_payment_succeeded, event_data)
        
        elif event_type == "subscription.deleted":
            # Subscription was cancelled - update user's plan
            print(f"Subscription {event_data['object']['id']} was cancelled")
        
        # Return a success response
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process webhook: {str(e)}"
        )
