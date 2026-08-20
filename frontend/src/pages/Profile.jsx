import { Outlet } from "react-router-dom";
import Sidebar from "../components/profile/shared/Sidebar";
import { useInformationForm } from "../hooks/useInformationForm";

const Profile = () => {
  const informationForm = useInformationForm();

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#F9F9F9]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto md:px-10 pb-5">
        <div className="mx-auto px-10">
          <Outlet context={informationForm} />
        </div>
      </main>
    </div>
  );
};

export default Profile;