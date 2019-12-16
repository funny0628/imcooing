import React, { Component } from "react";
import FriendsList from "./FriendsList/index.js";
import Group from "./Group/index.js";

class AddressBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasgroup: 4,
      //默认打开显示通讯录
      friendorgroup: true
    };
  }

  //群组的点击事件
  hasgroup = a => {
    const friendorgroup = this.state.friendorgroup;
    //
    //
    //
    //获取如果有群组的信息,则显示替换通讯录列表
    this.setState(state => ({
      friendorgroup: !state.friendorgroup
    }));

    this.props.contentUlRef && (this.props.contentUlRef.current.scrollTop = 0);
  };

  render() {
    const { friendorgroup } = this.state;
    return (
      <div>
        {friendorgroup ? (
          <FriendsList hasgroup={this.hasgroup} />
        ) : (
          <Group group={this.hasgroup} />
        )}
      </div>
    );
  }
}
export default AddressBook;
