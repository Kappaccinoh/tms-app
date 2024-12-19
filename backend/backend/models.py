from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=100, blank=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email

class Ticket(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]

    CATEGORY_CHOICES = [
        ('technical', 'Technical Issue'),
        ('billing', 'Billing'),
        ('general', 'General Inquiry'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    submitter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submitted_tickets')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    first_response_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"#{self.id} - {self.title}"

    def resolve(self):
        self.status = 'resolved'
        self.resolved_at = timezone.now()
        self.save()

class TicketAttachment(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='ticket_attachments/')
    filename = models.CharField(max_length=255)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment for ticket #{self.ticket.id}"

class TicketComment(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_internal = models.BooleanField(default=False)  # For admin-only comments

    def __str__(self):
        return f"Comment on ticket #{self.ticket.id} by {self.author.username}"

class TicketHistory(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='history')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)  # e.g., "changed status", "added comment"
    details = models.JSONField()  # Store the changes made
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"History entry for ticket #{self.ticket.id}"

class Report(models.Model):
    REPORT_TYPES = [
        ('performance', 'Performance Summary'),
        ('ticket_volume', 'Ticket Volume'),
        ('response_time', 'Response Time'),
        ('custom', 'Custom Report'),
    ]

    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=REPORT_TYPES)
    parameters = models.JSONField(default=dict)  # Store report parameters
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    last_generated = models.DateTimeField(null=True, blank=True)
    schedule = models.JSONField(null=True, blank=True)  # For scheduled reports

    def __str__(self):
        return self.name

class ReportResult(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='results')
    data = models.JSONField()  # Store the report results
    generated_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='report_results/', null=True, blank=True)

    def __str__(self):
        return f"Results for {self.report.name}"

class RecurringPattern(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]

    pattern = models.CharField(max_length=200)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    last_occurrence = models.DateTimeField()
    similar_tickets = models.IntegerField(default=0)
    potential_cause = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.pattern

class AnalyticsData(models.Model):
    DATA_TYPES = [
        ('resolution_time', 'Resolution Time'),
        ('ticket_volume', 'Ticket Volume'),
        ('response_time', 'Response Time'),
        ('user_impact', 'User Impact'),
        ('peak_hours', 'Peak Hours'),
        ('category_distribution', 'Category Distribution'),
        ('resolution_efficiency', 'Resolution Efficiency'),
        ('sla_compliance', 'SLA Compliance'),
    ]

    type = models.CharField(max_length=30, choices=DATA_TYPES)
    date = models.DateField()
    data = models.JSONField()  # Store analytics metrics
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['type', 'date']

    def __str__(self):
        return f"{self.type} data for {self.date}"

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('ticket_update', 'Ticket Update'),
        ('assignment', 'Ticket Assignment'),
        ('mention', 'Mention'),
        ('report_ready', 'Report Ready'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    reference_id = models.IntegerField(null=True)  # ID of related object
    reference_type = models.CharField(max_length=50, null=True)  # Type of related object

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"

class SLAConfig(models.Model):
    priority = models.CharField(max_length=20, choices=Ticket.PRIORITY_CHOICES)
    response_time_threshold = models.IntegerField(help_text='In minutes')
    resolution_time_threshold = models.IntegerField(help_text='In minutes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['priority']

    def __str__(self):
        return f"SLA Config for {self.priority} priority"

class ResolutionMetrics(models.Model):
    ticket = models.OneToOneField(Ticket, on_delete=models.CASCADE)
    complexity_score = models.IntegerField(default=0)
    resolution_time = models.DurationField()
    first_response_time = models.DurationField()
    sla_breached = models.BooleanField(default=False)
    reopened_count = models.IntegerField(default=0)

    def __str__(self):
        return f"Metrics for ticket #{self.ticket.id}"
