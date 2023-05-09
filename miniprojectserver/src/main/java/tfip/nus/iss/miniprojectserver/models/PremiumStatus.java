package tfip.nus.iss.miniprojectserver.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
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
@Table(name = "premiumstatus")
public class PremiumStatus {

    @Id
    @GeneratedValue
    private Integer id;

    @Column(insertable = false, updatable = false)
    private Integer user_id;
  
    private Boolean isPremium;
    
    private Integer swipes;

    @OneToOne
    @MapsId
    @JoinColumn(name="user_id")
    private User user;
    
}
