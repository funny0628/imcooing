import React, { Component } from "react";
import styles from "./index.less";

import { Progress, Icon } from "antd";
class Loading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <Icon type="loading" spin style={{ color: "#acb9bf", fontSize: 50 }} />
        <div className={styles.progressContainer}>
          <Progress
            percent={100}
            strokeWidth={3}
            showInfo={false}
            status="active"
            strokeColor={{
              from: "#02d1a4",
              to: "#e0e4e5"
            }}
          />
        </div>
      </div>
    );
  }
}
export default Loading;
