import MyDatasets from "./MyDatasets";
import UserProfile from "./UserProfile/index";

const Profile: React.FC = () => {
  return (
    <div className="grid grid-cols-5 gap-8">
      <div className="">
        <UserProfile />
      </div>
      <div className="col-span-4">
        <h1 className="text-left mt-0">My Datasets</h1>
        <MyDatasets />
      </div>
    </div>
  );
};

export default Profile;
