from rest_framework import serializers
from .models import User, Ticket, TicketAttachment, TicketComment, TicketHistory, Report, ReportResult, RecurringPattern, AnalyticsData, Notification, SLAConfig, ResolutionMetrics

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'department', 'is_admin', 'created_at']
        read_only_fields = ['created_at']

class TicketAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketAttachment
        fields = ['id', 'file', 'filename', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['uploaded_at']

class TicketCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = TicketComment
        fields = ['id', 'content', 'author', 'author_name', 'created_at', 'is_internal']
        read_only_fields = ['created_at']

class TicketHistorySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = TicketHistory
        fields = ['id', 'user', 'user_name', 'action', 'details', 'timestamp']
        read_only_fields = ['timestamp']

class TicketSerializer(serializers.ModelSerializer):
    attachments = TicketAttachmentSerializer(many=True, read_only=True)
    comments = TicketCommentSerializer(many=True, read_only=True)
    history = TicketHistorySerializer(many=True, read_only=True)
    submitter_name = serializers.CharField(source='submitter.username', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'submitter', 'submitter_name',
            'assigned_to', 'assigned_to_name', 'priority', 'status',
            'category', 'created_at', 'updated_at', 'resolved_at',
            'first_response_at', 'attachments', 'comments', 'history'
        ]
        read_only_fields = ['created_at', 'updated_at', 'resolved_at', 'first_response_at']

class ReportSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'name', 'type', 'parameters', 'created_by', 'created_by_name',
            'created_at', 'last_generated', 'schedule'
        ]
        read_only_fields = ['created_at', 'last_generated']

class ReportResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportResult
        fields = ['id', 'report', 'data', 'generated_at', 'generated_by', 'file']
        read_only_fields = ['generated_at']

class RecurringPatternSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringPattern
        fields = [
            'id', 'pattern', 'frequency', 'last_occurrence', 'similar_tickets',
            'potential_cause', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class AnalyticsDataSerializer(serializers.ModelSerializer):
    def validate_data(self, value):
        """
        Validate the JSON data structure based on the analytics type
        """
        data_type = self.initial_data.get('type')
        
        # Define required fields for each type
        required_fields = {
            'peak_hours': ['hour', 'count'],
            'category_distribution': ['category', 'count'],
            'resolution_efficiency': ['complexity', 'time', 'success_rate'],
            'sla_compliance': ['met', 'breached', 'percentage'],
        }
        
        if data_type in required_fields:
            for field in required_fields[data_type]:
                if field not in value:
                    raise serializers.ValidationError(
                        f"Missing required field '{field}' for {data_type} analytics"
                    )
        
        return value

    class Meta:
        model = AnalyticsData
        fields = ['id', 'type', 'date', 'data', 'created_at']
        read_only_fields = ['created_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'type', 'title', 'message', 'read',
            'created_at', 'reference_id', 'reference_type'
        ]
        read_only_fields = ['created_at']

class SLAConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SLAConfig
        fields = [
            'id', 'priority', 'response_time_threshold',
            'resolution_time_threshold', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class ResolutionMetricsSerializer(serializers.ModelSerializer):
    ticket_title = serializers.CharField(source='ticket.title', read_only=True)
    
    class Meta:
        model = ResolutionMetrics
        fields = [
            'id', 'ticket', 'ticket_title', 'complexity_score',
            'resolution_time', 'first_response_time', 'sla_breached',
            'reopened_count'
        ]
