from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    department = models.CharField(max_length=100)
    role = models.CharField(max_length=50, default='user')

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    CATEGORY_CHOICES = [
        ('technical', 'Technical'),
        ('billing', 'Billing'),
        ('general', 'General'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    submitter = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    first_response_at = models.DateTimeField(null=True, blank=True)

# Analytics Models
class DashboardMetrics(models.Model):
    date = models.DateField()
    open_tickets = models.IntegerField(default=0)
    active_users = models.IntegerField(default=0)
    avg_resolution_time = models.DurationField(default=timezone.timedelta(hours=0))
    satisfaction_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

class TicketMetrics(models.Model):
    date = models.DateField()
    ticket_count = models.IntegerField(default=0)
    open_count = models.IntegerField(default=0)
    resolved_count = models.IntegerField(default=0)
    avg_resolution_time = models.DurationField(default=timezone.timedelta(hours=0))

class CategoryDistribution(models.Model):
    date = models.DateField()
    category = models.CharField(max_length=50)
    count = models.IntegerField(default=0)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)

class PriorityMetrics(models.Model):
    date = models.DateField()
    priority = models.CharField(max_length=20, choices=Ticket.PRIORITY_CHOICES)
    resolved_count = models.IntegerField(default=0)
    pending_count = models.IntegerField(default=0)
    avg_resolution_time = models.DurationField(default=timezone.timedelta(hours=0))

class ImpactMetrics(models.Model):
    date = models.DateField()
    affected_users = models.IntegerField(default=0)
    system_downtime = models.DurationField(default=timezone.timedelta(hours=0))
    sla_breaches = models.IntegerField(default=0)
    first_response_time = models.DurationField(default=timezone.timedelta(hours=0))

class HourlyTicketCount(models.Model):
    date = models.DateField()
    hour = models.IntegerField()  # 0-23
    count = models.IntegerField(default=0)

class RecurringPattern(models.Model):
    pattern = models.CharField(max_length=200)
    frequency = models.CharField(max_length=50)
    last_occurrence = models.DateTimeField()
    similar_tickets = models.IntegerField(default=0)
    potential_cause = models.CharField(max_length=200)

# Support Models
class TicketComment(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_internal = models.BooleanField(default=False)

class TicketHistory(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=50)
    details = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)

class TicketAttachment(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    file = models.FileField(upload_to='attachments/')
    filename = models.CharField(max_length=255)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Report(models.Model):
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=50)
    parameters = models.JSONField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    last_generated = models.DateTimeField(null=True)
    schedule = models.CharField(max_length=50, null=True)  # For recurring reports

class AnalyticsData(models.Model):
    type = models.CharField(max_length=50)
    date = models.DateField()
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['type', 'date']

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('ticket_update', 'Ticket Update'),
        ('assignment', 'Ticket Assignment'),
        ('mention', 'Mention'),
        ('report_ready', 'Report Ready'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    reference_id = models.IntegerField(null=True)  # ID of related object
    reference_type = models.CharField(max_length=50, null=True)  # Type of related object

class ReportResult(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    generated_at = models.DateTimeField(auto_now_add=True)
    data = models.JSONField()
    file_url = models.URLField(null=True, blank=True)
    status = models.CharField(max_length=20, default='pending')
    error_message = models.TextField(null=True, blank=True)

class SLAConfig(models.Model):
    priority = models.CharField(max_length=20, choices=Ticket.PRIORITY_CHOICES)
    response_time = models.DurationField(default=timezone.timedelta(hours=1))
    resolution_time = models.DurationField(default=timezone.timedelta(hours=24))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ResolutionMetrics(models.Model):
    date = models.DateField()
    avg_time = models.DurationField(default=timezone.timedelta(hours=0))
    within_sla = models.IntegerField(default=0)
    breached_sla = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
