import React, { Component } from "react";
import { Modal } from "antd";
import styles from "./index.less";
class maxImg extends Component {
  constructor(params) {
    super(params);
  }
  handleCancel = () => {
    this.props.HideMaxImg(false);
  };
  render() {
    const src = this.props.maxImgSrc;
    const show = this.props.showMaxImg;
    return (
      <Modal
        visible={show}
        destroyOnClose
        afterClose={this.afterClose}
        footer={null}
        width={1136}
        onCancel={this.handleCancel}
      >
        <div className={styles.alertImgWrap}>
          <img src={src} alt="" className={styles.alertImg} />
        </div>
      </Modal>
    );
  }
}

export default maxImg;
