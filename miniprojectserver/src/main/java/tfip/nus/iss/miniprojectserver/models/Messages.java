package tfip.nus.iss.miniprojectserver.models;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="Messages")
public class Messages {

    @Id
    @GeneratedValue
    private Integer id;

    private Integer senderId;

    private Integer receiverId;

    private String message;

    private Instant timestamp;

    @PrePersist
    public void prePersist() {
        timestamp = Instant.now();
    }

    
}
