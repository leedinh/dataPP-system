import { DatasetInfo } from "redux/features/datasets/slice";
import { List, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import DatasetWidget from "components/DatasetWidget";
import useFilter from "hook/useFilter";
import useTopic from "hook/useTopic";
import styles from "pages/styles.module.scss";
import { useState } from "react";

type DatasetsProps = {
  data: DatasetInfo[];
};

const Datasets: React.FC<DatasetsProps> = ({ data }) => {
  const { topicLabels } = useTopic();
  const { pushQuery, topic, popQueries, dataset } = useFilter();
  const [searchKey, setSearchKey] = useState("");

  const onChange = (topic: string) => {
    // console.log("Click button ", topic);
    if (topic === "-1") {
      popQueries(["topic"]);
    } else {
      pushQuery("topic", topic);
    }
  };

  const handleSearch = () => {
    if (!!searchKey) {
      pushQuery("dataset", searchKey);
    } else {
      popQueries(["dataset"]);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 mt-8">
        <div className="col-span-1 justify-self-start text-3xl font-semibold">
          Dataset
        </div>
        <div className="justify-end col-span-2 flex flex-wrap gap-4 mb-4">
          <div className="">
            <Input
              className="rounded-full w-[100px] lg:w-[200px] px-4"
              placeholder="dataset name"
              onChange={(e) => setSearchKey(e.target.value)}
              onPressEnter={() => handleSearch()}
              suffix={
                <Button
                  shape="circle"
                  type="text"
                  onClick={() => handleSearch()}
                  icon={<SearchOutlined />}
                ></Button>
              }
            />
          </div>
          <div className="flex flex-wrap justify-end">
            {Object.entries(topicLabels).map(([key, value]) => {
              return (
                <div
                  onClick={() => onChange(key)}
                  key={key}
                  className={`${styles.tab} ${
                    topic === key && styles.tabActive
                  }`}
                >
                  {value}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={
          dataset ? data.filter((value) => value.title.includes(dataset)) : data
        }
        pagination={{
          pageSize: 8,
        }}
        renderItem={(item) => (
          <List.Item key={item.did}>
            <DatasetWidget {...item} />
          </List.Item>
        )}
      />
    </>
  );
};

export default Datasets;
