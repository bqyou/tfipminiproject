package tfip.nus.iss.miniprojectserver.models;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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

    private Integer sender_id;

    private Integer receiver_id;

    private String message;

    private Date timestamp;
    
}
