import TopDataset from "components/TopDataset";
import Banner from "components/Banner";
import Datasets from "./Datasets";

const fakeData = [
  {
    name: "A",
    type: "ABC",
  },
  {
    name: "A",
    type: "ABC",
  },
  {
    name: "A",
    type: "ABC",
  },
  {
    name: "A",
    type: "ABC",
  },
  {
    name: "A",
    type: "ABC",
  },
];

const Main: React.FC = () => {
  return (
    <div className="grid grid-cols-4">
      <div className="p-4 flex flex-col gap-8">
        <TopDataset title={"Download"} data={fakeData} />
        <TopDataset title={"Download"} data={fakeData} />
      </div>
      <div className="col-span-3 p-4 mx-16">
        <Banner />
        <Datasets />
      </div>
    </div>
  );
};

export default Main;
