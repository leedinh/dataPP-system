import MyDatasets from "./MyDatasets";
import UserProfile from "./UserProfile";

const Profile: React.FC = () => {
  return (
    <>
      <div className="my-8">
        <UserProfile />
      </div>
      <MyDatasets />
    </>
  );
};

export default Profile;
