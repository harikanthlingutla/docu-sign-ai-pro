import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from dotenv import load_dotenv
import logging
from typing import List, Optional

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", SMTP_USERNAME)

async def send_email(
    to_emails: List[str],
    subject: str,
    html_content: str,
    text_content: Optional[str] = None,
    attachments: Optional[List[tuple]] = None,
    from_email: Optional[str] = None
):
    """
    Send an email with optional attachments.
    
    Args:
        to_emails: List of recipient email addresses
        subject: Email subject
        html_content: HTML content of the email
        text_content: Plain text content (fallback for HTML)
        attachments: List of tuples (filename, file_content, mime_type)
        from_email: Sender email address (defaults to configured email)
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = from_email or DEFAULT_FROM_EMAIL
        message["To"] = ", ".join(to_emails)
        
        # Add text content as fallback
        if text_content:
            message.attach(MIMEText(text_content, "plain"))
        
        # Add HTML content as primary
        message.attach(MIMEText(html_content, "html"))
        
        # Add attachments if provided
        if attachments:
            for filename, file_content, mime_type in attachments:
                attachment = MIMEApplication(file_content)
                attachment.add_header(
                    "Content-Disposition", f"attachment; filename={filename}"
                )
                message.attach(attachment)
        
        # Connect to SMTP server and send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(
                message["From"], to_emails, message.as_string()
            )
        
        logger.info(f"Email sent successfully to {', '.join(to_emails)}")
        return True
    
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

async def send_signed_document(
    to_email: str,
    document_name: str,
    document_content: bytes,
    sender_name: str,
    custom_message: Optional[str] = None
):
    """
    Send a signed document via email.
    
    Args:
        to_email: Recipient email address
        document_name: Name of the document
        document_content: Binary content of the document
        sender_name: Name of the sender
        custom_message: Optional custom message to include
    
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    subject = f"Signed Document: {document_name}"
    
    # Create HTML content
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #4a6ee0; color: white; padding: 10px; text-align: center; }}
            .footer {{ background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }}
            .content {{ padding: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>SignThatDoc - Signed Document</h2>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>{sender_name} has signed a document and shared it with you.</p>
                <p><strong>Document:</strong> {document_name}</p>
                
                {f"<p><strong>Message:</strong> {custom_message}</p>" if custom_message else ""}
                
                <p>The signed document is attached to this email. It has been cryptographically 
                signed using post-quantum cryptography (CRYSTALS-Dilithium).</p>
                
                <p>Thank you for using SignThatDoc!</p>
            </div>
            <div class="footer">
                <p>This is an automated message from SignThatDoc. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Create plain text content as fallback
    text_content = f"""
    SignThatDoc - Signed Document
    
    Hello,
    
    {sender_name} has signed a document and shared it with you.
    
    Document: {document_name}
    
    {f"Message: {custom_message}" if custom_message else ""}
    
    The signed document is attached to this email. It has been cryptographically 
    signed using post-quantum cryptography (CRYSTALS-Dilithium).
    
    Thank you for using SignThatDoc!
    
    This is an automated message from SignThatDoc. Please do not reply to this email.
    """
    
    # Define attachment
    attachments = [(document_name, document_content, "application/pdf")]
    
    # Send email
    return await send_email(
        to_emails=[to_email],
        subject=subject,
        html_content=html_content,
        text_content=text_content,
        attachments=attachments
    )
