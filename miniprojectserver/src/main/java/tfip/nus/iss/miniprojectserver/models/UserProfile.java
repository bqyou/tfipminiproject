package tfip.nus.iss.miniprojectserver.models;

import java.sql.Blob;
import java.sql.Date;

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
@Table(name = "profiles")
public class UserProfile {

    @Id
    @GeneratedValue
    private Integer id;

    @Column(insertable = false, updatable = false)
    private Integer user_id;

    private String displayName;
    private Date dateOfBirth;
    private String gender;
    private String preference;
    private Blob profilePic;
    private String imageType;

    @Builder.Default
    private Boolean completed = false;

    @OneToOne
    @MapsId
    @JoinColumn(name="user_id")
    private User user;

    // public static UserProfile populate(ResultSet rs) throws SQLException {
    //     final UserProfile userProfile = new UserProfile();
    //     userProfile.setDateOfBirth(rs.getDate("dateOfBirth"));
    //     userProfile.setDisplayName(rs.getString("displayName"));
        
    //     userProfile.setGender(rs.getString("gender"));
    //     userProfile.setPreference(rs.getString("preference"));
    //     userProfile.setProfilePic(rs.getBytes("profilePic"));
    //     userProfile.setImageType(rs.getString("imageType"));
        
    //     return userProfile;
    // }
    
}
