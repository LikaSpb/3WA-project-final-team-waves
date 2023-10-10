import Profil from "../../components/Profil/Profil";
import useAuth from "../../hooks/auth.hooks";

const ProfilPage = () => {
  useAuth();
  return (
    <div>
      <Profil />
    </div>
  );
};

export default ProfilPage;
