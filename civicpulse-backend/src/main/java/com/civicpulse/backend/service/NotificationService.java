package com.civicpulse.backend.service;

import com.civicpulse.backend.entity.Complaint;
import com.civicpulse.backend.entity.Notification;
import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void notifyComplaintSubmitted(Complaint complaint) {
        if (complaint.getReportedBy() != null) {
            createNotification(
                complaint.getReportedBy(),
                "Complaint Submitted",
                "Your complaint \"" + complaint.getTitle() + "\" has been submitted successfully. ID: " + complaint.getId(),
                Notification.NotificationType.COMPLAINT_SUBMITTED,
                complaint.getId()
            );
        }
    }

    public void notifyStatusChange(Complaint complaint, Complaint.IssueStatus newStatus) {
        String statusText = switch (newStatus) {
            case ACKNOWLEDGED -> "acknowledged by the authorities";
            case IN_PROGRESS -> "being worked on by a field worker";
            case RESOLVED -> "resolved! Thank you for reporting.";
            case REJECTED -> "rejected by the authorities";
            default -> "updated";
        };

        // Notify citizen
        if (complaint.getReportedBy() != null) {
            createNotification(
                complaint.getReportedBy(),
                "Complaint " + newStatus.name().replace("_", " "),
                "Your complaint \"" + complaint.getTitle() + "\" has been " + statusText,
                mapStatusToType(newStatus),
                complaint.getId()
            );
        }

        // Notify assigned worker
        if (complaint.getAssignedTo() != null && newStatus == Complaint.IssueStatus.ACKNOWLEDGED) {
            createNotification(
                complaint.getAssignedTo(),
                "New Task Assigned",
                "You have been assigned: \"" + complaint.getTitle() + "\" at " + complaint.getAddress(),
                Notification.NotificationType.COMPLAINT_ASSIGNED,
                complaint.getId()
            );
        }
    }

    public void notifySlaWarning(Complaint complaint) {
        if (complaint.getAssignedTo() != null) {
            createNotification(
                complaint.getAssignedTo(),
                "SLA Warning",
                "Complaint \"" + complaint.getTitle() + "\" is approaching its SLA deadline!",
                Notification.NotificationType.SLA_WARNING,
                complaint.getId()
            );
        }
    }

    public void notifySlaBreach(Complaint complaint) {
        if (complaint.getAssignedTo() != null) {
            createNotification(
                complaint.getAssignedTo(),
                "SLA Breached!",
                "Complaint \"" + complaint.getTitle() + "\" has breached its SLA deadline!",
                Notification.NotificationType.SLA_BREACH,
                complaint.getId()
            );
        }
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    private void createNotification(User user, String title, String message,
                                     Notification.NotificationType type, String complaintId) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .complaintId(complaintId)
                .build();
        notificationRepository.save(notification);
        log.info("Notification created for user {}: {}", user.getEmail(), title);
    }

    private Notification.NotificationType mapStatusToType(Complaint.IssueStatus status) {
        return switch (status) {
            case SUBMITTED -> Notification.NotificationType.COMPLAINT_SUBMITTED;
            case ACKNOWLEDGED -> Notification.NotificationType.COMPLAINT_ACKNOWLEDGED;
            case IN_PROGRESS -> Notification.NotificationType.COMPLAINT_IN_PROGRESS;
            case RESOLVED -> Notification.NotificationType.COMPLAINT_RESOLVED;
            case REJECTED -> Notification.NotificationType.COMPLAINT_REJECTED;
        };
    }
}
