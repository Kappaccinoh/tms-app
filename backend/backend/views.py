from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    User, Ticket, TicketAttachment, TicketComment, 
    TicketHistory, Report, AnalyticsData, Notification,
    DashboardMetrics, TicketMetrics, CategoryDistribution,
    PriorityMetrics, ImpactMetrics, HourlyTicketCount,
    RecurringPattern
)
from .serializers import (
    UserSerializer, TicketSerializer, TicketAttachmentSerializer,
    TicketCommentSerializer, TicketHistorySerializer, ReportSerializer,
    AnalyticsDataSerializer, NotificationSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        ticket = self.get_object()
        serializer = TicketCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(ticket=ticket, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def upload_attachment(self, request, pk=None):
        ticket = self.get_object()
        file_serializer = TicketAttachmentSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save(ticket=ticket, uploaded_by=request.user)
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        ticket = self.get_object()
        ticket.resolve()
        return Response({'status': 'ticket resolved'})

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        report = self.get_object()
        # TODO: Implement report generation logic
        return Response({'status': 'report generation started'})

class AnalyticsViewSet(viewsets.ModelViewSet):
    queryset = AnalyticsData.objects.all()
    serializer_class = AnalyticsDataSerializer

    @action(detail=False, methods=['get'])
    def dashboard_metrics(self, request):
        # TODO: Implement dashboard metrics calculation
        return Response({
            'open_tickets': Ticket.objects.filter(status='open').count(),
            'resolution_time': '2.4h',  # TODO: Calculate actual average
            'satisfaction_rate': '94%',  # TODO: Calculate actual rate
        })

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.read = True
        notification.save()
        return Response({'status': 'notification marked as read'}) 