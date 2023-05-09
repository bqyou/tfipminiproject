package tfip.nus.iss.miniprojectserver.repo;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import tfip.nus.iss.miniprojectserver.Utils;


@Repository
public class UserProfileRepo {

    @Autowired
    private DataSource dataSource;    

    public static final String SQL_COMPLETE_PROFILE = """
            UPDATE profiles
            SET date_of_birth = ?, display_name = ?, gender = ?, image_type = ?, preference = ?, profile_pic = ?, completed = ?
            WHERE user_id = ?
            """;

    public static final String SQL_GET_USER_BY_EMAIL = "SELECT * FROM verifiedusers WHERE email = ?";
    
     
    @Transactional
    public Integer completeProfile(MultipartFile profilePic,
            String displayName, String dateOfBirth, String gender,
            String preference, Integer userID) throws SQLException, IOException {
        Integer rowsUpdated = 0;
        String dateOfBirthStr = dateOfBirth;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        java.util.Date utilDateOfBirth = new Date(0);
        try {
            utilDateOfBirth = sdf.parse(dateOfBirthStr);
        } catch (ParseException e) {
            e.printStackTrace();
            return rowsUpdated;
        }
        java.sql.Date sqlDateOfBirth = new java.sql.Date(utilDateOfBirth.getTime());

        String imageType = profilePic.getContentType();
        
        
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            con = dataSource.getConnection();
            pstmt = con.prepareStatement(SQL_COMPLETE_PROFILE);
            InputStream is = profilePic.getInputStream();
            pstmt.setDate(1, sqlDateOfBirth);
            pstmt.setString(2, displayName);
            pstmt.setString(3, gender);
            pstmt.setString(4, imageType);
            pstmt.setString(5, preference);
            pstmt.setBinaryStream(6, is, profilePic.getSize());
            pstmt.setBoolean(7, true);
            pstmt.setInt(8, userID);
            rowsUpdated = pstmt.executeUpdate();
        } catch (SQLException | IOException e) {
            e.printStackTrace();
            return rowsUpdated;
        } finally {
            if (pstmt != null) {
                try {
                    pstmt.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (con != null) {
                try {
                    con.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return rowsUpdated;
    }

    @Transactional
    public Integer updateProfile(String profilePic,
            String displayName, String dateOfBirth, String gender,
            String preference, Integer userID) throws SQLException, IOException {
        Integer rowsUpdated = 0;
        String dateOfBirthStr = dateOfBirth;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        java.util.Date utilDateOfBirth = new Date(0);
        try {
            utilDateOfBirth = sdf.parse(dateOfBirthStr);
        } catch (ParseException e) {
            e.printStackTrace();
            return rowsUpdated;
        }
        java.sql.Date sqlDateOfBirth = new java.sql.Date(utilDateOfBirth.getTime());
        String imageType = "";
        String[] parts = profilePic.split(",");
        if (parts.length > 0) {
            String header = parts[0];
            String[] headerParts = header.split(";");
        if (headerParts.length > 0) {
            imageType = headerParts[0].substring(headerParts[0].indexOf(":") + 1);
        }
        }     
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            con = dataSource.getConnection();
            pstmt = con.prepareStatement(SQL_COMPLETE_PROFILE);
            Blob blob = Utils.dataURLtoBlob(profilePic);
            pstmt.setDate(1, sqlDateOfBirth);
            pstmt.setString(2, displayName);
            pstmt.setString(3, gender);
            pstmt.setString(4, imageType);
            pstmt.setString(5, preference);
            pstmt.setBlob(6, blob);
            pstmt.setBoolean(7, true);
            pstmt.setInt(8, userID);
            rowsUpdated = pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            return rowsUpdated;
        } finally {
            if (pstmt != null) {
                try {
                    pstmt.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (con != null) {
                try {
                    con.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return rowsUpdated;
    }


}

