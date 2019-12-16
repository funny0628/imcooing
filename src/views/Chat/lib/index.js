import { deepCopy } from "../../../utils/lib";

// 这个文件的历史可以去原来的地方参考
const memberTypes = {
  1: "群主",
  2: "管理员"
  // 3:"普通成员",
  // 4:"游客"
};
const memberIcons = {
  1: "woner",
  2: "banned"
  // 3:"普通成员",
  // 4:"游客"
};
const initOrigin = [
  {
    letter: "群主,管理员",
    list: []
  },
  {
    letter: "群成员",
    list: []
  }
];

export const handleGroupDetail = (list, originList, add) => {
  const _origins = JSON.parse(JSON.stringify(add ? originList : initOrigin));
  return _origins;
};
