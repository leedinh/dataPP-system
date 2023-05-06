import MyDatasets from "./MyDatasets";
import UserProfile from "./UserProfile";

const Profile: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="">
        <UserProfile />
      </div>
      <div className="col-span-3">
        <MyDatasets />
      </div>
    </div>
  );
};

export default Profile;
