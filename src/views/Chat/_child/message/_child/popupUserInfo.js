import * as React from "react";
import styles from "../index.less";
import { imgurl } from "../../../../../utils/Basicmethod";
import { connect } from "dva";

@connect(
  ({ QueryFriendRelationByUin }) => ({
    //通过uin或手机号查询是否是好友关系-->获取用户的信息
    userInfo: QueryFriendRelationByUin.userInfo,
    errorCode: QueryFriendRelationByUin.errorCode,
    uin: QueryFriendRelationByUin.uin
  }),
  dispatch => ({
    GetFriendRelation: id =>
      dispatch({
        type: "QueryFriendRelationByUin/GetFriendRelation",
        uin: id
      })
  })
)
export default class PopupUserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.stata = {};
  }

  componentWillMount() {
    const {
      props: { GetFriendRelation, uniqueId }
    } = this;

    GetFriendRelation(uniqueId); // 获取好友信息
  }

  close(userInfo) {
    const {
      props: { ChatType, clsoeSingle, clsoeGroup }
    } = this;

    if (ChatType === 1) {
      clsoeSingle();
      return;
    }
    clsoeGroup(userInfo);
  }

  render() {
    const { userInfo = {} } = this.props;
    const { remark } = userInfo;
    return (
      // <CSSTransition in={show} timeout={100} classNames="fade">
      <div className={styles.usermsg}>
        <img
          className={styles.userimg}
          src={imgurl + userInfo.smallAvatarUrl}
          alt=""
        />
        <p className={styles.title}> {userInfo.nickName} </p>
        {remark && (
          <p style={{ marginTop: "10px" }} className={styles.title}>
            备注: {remark}
          </p>
        )}
        <p className={styles.userid}> ID: {userInfo.uniqueId} </p>
        <span onClick={() => this.close(userInfo)}> 发消息 </span>
      </div>
      // </CSSTransition>
    );
  }
}
