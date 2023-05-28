import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import styles from "pages/styles.module.scss";

import RuleSet from "./RuleSet";
import { useState } from "react";
type AnonymizeIconProps = {
  is_anonymized: boolean;
  did: string;
  status: string;
};

const AnonymizeIcon: React.FC<AnonymizeIconProps> = ({
  did,
  is_anonymized,
  status,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      {is_anonymized ? (
        <div className="">
          <div className="">
            <CheckCircleOutlined
              onMouseEnter={() => setVisible(true)}
              onMouseLeave={() => setVisible(false)}
              className={`text-slate-400 ${styles.icon}`}
            />
          </div>
          <div className="">
            {is_anonymized && (
              <RuleSet did={did} disabled={status !== "completed"} />
            )}
          </div>
        </div>
      ) : (
        <CloseCircleOutlined className={`text-slate-400 ${styles.icon}`} />
      )}
    </div>
  );
};

export default AnonymizeIcon;
