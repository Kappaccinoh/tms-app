from rest_framework import serializers
from .models import (
    User, Ticket, TicketAttachment, TicketComment, 
    TicketHistory, Report, ReportResult, RecurringPattern, 
    AnalyticsData, Notification, SLAConfig, ResolutionMetrics,
    DashboardMetrics, TicketMetrics, CategoryDistribution,
    PriorityMetrics, ImpactMetrics, HourlyTicketCount
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'department', 'role']

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class TicketAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketAttachment
        fields = '__all__'

class TicketCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketComment
        fields = '__all__'

class TicketHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketHistory
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

class ReportResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportResult
        fields = '__all__'

class AnalyticsDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsData
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class SLAConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SLAConfig
        fields = '__all__'

class ResolutionMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResolutionMetrics
        fields = '__all__'

# Add serializers for analytics models
class DashboardMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardMetrics
        fields = '__all__'

class TicketMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketMetrics
        fields = '__all__'

class CategoryDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryDistribution
        fields = '__all__'

class PriorityMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriorityMetrics
        fields = '__all__'

class ImpactMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactMetrics
        fields = '__all__'

class HourlyTicketCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = HourlyTicketCount
        fields = '__all__'

class RecurringPatternSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringPattern
        fields = '__all__'
