package tfip.nus.iss.miniprojectserver.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import tfip.nus.iss.miniprojectserver.models.Messages;

@Repository
public interface MessagesRepository extends JpaRepository<Messages, Integer> {

    @Query("""
        SELECT m 
        FROM Messages m 
        WHERE (m.senderId = :senderId AND m.receiverId = :receiverId) 
        OR (m.senderId = :receiverId AND m.receiverId = :senderId) 
        ORDER BY m.timestamp ASC
        """)
    List<Messages> findMessagesBetweenUsers(@Param("senderId") Integer senderId, @Param("receiverId") Integer receiverId);
    
}
