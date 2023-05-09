package tfip.nus.iss.miniprojectserver.models;

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
@Table(name="YesTable")
public class YesTable {

    @Id
    @GeneratedValue
    private Integer id;

    private Integer activeUserId;

    private Integer matchId;
    
}
