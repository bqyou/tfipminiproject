package tfip.nus.iss.miniprojectserver.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tfip.nus.iss.miniprojectserver.models.TempUser;

@Repository
public interface TempUserRepository extends JpaRepository<TempUser, Integer>{
    
}
