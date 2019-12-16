const countryData = [
  {
    title: "A",
    data: [
      { name: "阿尔巴尼亚", num: "+355" },
      { name: "阿尔及利亚", num: "+213" },
      { name: "阿富汗", num: "+93" },
      { name: "阿根廷", num: "+54" },
      { name: "阿拉伯联合酋长国", num: "+971" },
      { name: "阿鲁巴岛", num: "+297" },
      { name: "阿曼", num: "+968" },
      { name: "阿塞拜疆", num: "+994" },
      { name: "埃及", num: "+20" },
      { name: "埃塞俄比亚", num: "+251" },
      { name: "爱尔兰", num: "+353" },
      { name: "爱沙尼亚", num: "+372" },
      { name: "安道尔", num: "+376" },
      { name: "安哥拉", num: "+244" },
      { name: "安圭拉岛", num: "+1264" },
      { name: "安提瓜和巴布达", num: "+1268" },
      { name: "奥地利", num: "+43" },
      { name: "澳大利亚", num: "+61" },
      { name: "澳门", num: "+853" }
    ]
  },
  {
    title: "B",
    data: [
      { name: "巴巴多斯", num: "+1246" },
      { name: "巴布亚新几内亚", num: "+675" },
      { name: "巴哈马", num: "+242" },
      { name: "巴基斯坦", num: "+92" },
      { name: "巴拉圭", num: "+595" },
      { name: "巴林", num: "+973" },
      { name: "巴拿马", num: "+507" },
      { name: "巴西", num: "+55" },
      { name: "白俄罗斯", num: "+375" },
      { name: "百慕大", num: "+1441" },
      { name: "保加利亚", num: "+359" },
      { name: "贝宁", num: "+229" },
      { name: "比利时", num: "+32" },
      { name: "冰岛", num: "+354" },
      { name: "波多黎各", num: "+1787" },
      { name: "波兰", num: "+48" },
      { name: "波斯尼亚和黑塞哥维那", num: "+387" },
      { name: "玻利维亚", num: "+591" },
      { name: "伯利兹", num: "+501" },
      { name: "博茨瓦纳", num: "+267" },
      { name: "不丹", num: "+975" },
      { name: "布基纳法索", num: "+226" },
      { name: "布隆迪", num: "+257" }
    ]
  },
  {
    title: "C",
    data: [{ name: "赤道几内亚", num: "+240" }]
  },
  {
    title: "D",
    data: [
      { name: "丹麦", num: "+45" },
      { name: "德国", num: "+49" },
      { name: "东帝汶", num: "+670" },
      { name: "多哥", num: "+228" },
      { name: "多米尼加", num: "+1809" },
      { name: "多米尼加共和国", num: "+809" }
    ]
  },
  {
    title: "E",
    data: [
      { name: "俄罗斯", num: "+7" },
      { name: "厄瓜多尔", num: "+593" }
    ]
  },
  {
    title: "F",
    data: [
      { name: "法国", num: "+33" },
      { name: "法罗群岛", num: "+298" },
      { name: "法属圭亚那", num: "+594" },
      { name: "菲律宾", num: "+63" },
      { name: "斐济", num: "+679" },
      { name: "芬兰", num: "+358" },
      { name: "佛得角", num: "+238" }
    ]
  },
  {
    title: "G",
    data: [
      { name: "冈比亚", num: "+220" },
      { name: "刚果共和国", num: "+242" },
      { name: "刚果民主共和国", num: "+242" },
      { name: "哥伦比亚", num: "+57" },
      { name: "哥斯达黎加", num: "+506" },
      { name: "格林纳达", num: "+1473" },
      { name: "格陵兰", num: "+299" },
      { name: "格鲁吉亚", num: "+995" },
      { name: "瓜德罗普", num: "+590" },
      { name: "关岛", num: "+1671" },
      { name: "圭亚那", num: "+592" }
    ]
  },
  {
    title: "H",
    data: [
      { name: "哈萨克", num: "+73" },
      { name: "海地", num: "+509" },
      { name: "韩国", num: "+82" },
      { name: "荷兰", num: "+31" },
      { name: "荷属安的列斯", num: "+599" },
      { name: "黑山共和国", num: "+382" },
      { name: "洪都拉斯", num: "+504" }
    ]
  },
  {
    title: "J",
    data: [
      { name: "基里巴斯", num: "+686" },
      { name: "吉布提", num: "+253" },
      { name: "吉尔吉斯斯坦", num: "+996" },
      { name: "几内亚", num: "+224" },
      { name: "几内亚比绍", num: "+245" },
      { name: "加拿大", num: "+1" },
      { name: "加纳", num: "+233" },
      { name: "加蓬", num: "+241" },
      { name: "柬埔寨", num: "+855" },
      { name: "捷克共和国", num: "+420" },
      { name: "津巴布韦", num: "+263" }
    ]
  },
  {
    title: "K",
    data: [
      { name: "喀麦隆", num: "+237" },
      { name: "卡塔尔", num: "+974" },
      { name: "开曼群岛", num: "+1345" },
      { name: "科摩罗", num: "+269" },
      { name: "科特迪瓦", num: "+225" },
      { name: "科威特", num: "+965" },
      { name: "克罗地亚", num: "+383" },
      { name: "肯尼亚", num: "+254" },
      { name: "库克群岛", num: "+682" }
    ]
  },
  {
    title: "L",
    data: [
      { name: "拉脱维亚", num: "+371" },
      { name: "莱索托", num: "+266" },
      { name: "老挝", num: "+856" },
      { name: "黎巴嫩", num: "+961" },
      { name: "立陶宛", num: "+370" },
      { name: "利比里亚", num: "+231" },
      { name: "利比亚", num: "+218" },
      { name: "列支敦士登", num: "+423" },
      { name: "留尼汪岛", num: "+262" },
      { name: "卢森堡", num: "+352" },
      { name: "卢旺达", num: "+250" },
      { name: "罗马尼亚", num: "+40" }
    ]
  },
  {
    title: "M",
    data: [
      { name: "马达加斯加", num: "+261" },
      { name: "马尔代夫", num: "+960" },
      { name: "马耳他", num: "+356" },
      { name: "马拉维", num: "+265" },
      { name: "马来西亚", num: "+60" },
      { name: "马里", num: "+223" },
      { name: "马其顿", num: "+389" },
      { name: "马提尼克", num: "+596" },
      { name: "毛里求斯", num: "+230" },
      { name: "毛里塔尼亚", num: "+222" },
      { name: "美国", num: "+1" },
      { name: "美属维尔京群岛", num: "+1340" },
      { name: "蒙古", num: "+976" },
      { name: "蒙特塞拉特岛", num: "+1664" },
      { name: "孟加拉国", num: "+880" },
      { name: "秘鲁", num: "+51" },
      { name: "缅甸", num: "+95" },
      { name: "摩尔多瓦", num: "+373" },
      { name: "摩洛哥", num: "+212" },
      { name: "摩纳哥", num: "+377" },
      { name: "莫桑比克", num: "+258" },
      { name: "墨西哥", num: "+52" }
    ]
  },
  {
    title: "N",
    data: [
      { name: "纳米比亚", num: "+264" },
      { name: "南非", num: "+27" },
      { name: "南苏丹", num: "+211" },
      { name: "尼泊尔", num: "+977" },
      { name: "尼加拉瓜", num: "+505" },
      { name: "尼日尔", num: "+227" },
      { name: "尼日利亚", num: "+234" },
      { name: "挪威", num: "+47" }
    ]
  },
  {
    title: "P",
    data: [
      { name: "帕劳群岛", num: "+680" },
      { name: "葡萄牙", num: "+351" }
    ]
  },
  {
    title: "R",
    data: [
      { name: "日本", num: "+81" },
      { name: "瑞典", num: "+46" },
      { name: "瑞士", num: "+41" }
    ]
  },
  {
    title: "S",
    data: [
      { name: "萨尔瓦多", num: "+503" },
      { name: "萨摩亚群岛", num: "+685" },
      { name: "塞尔维亚", num: "+381" },
      { name: "塞拉利昂", num: "+232" },
      { name: "塞内加尔", num: "+221" },
      { name: "塞浦路斯", num: "+357" },
      { name: "塞舌尔", num: "+248" },
      { name: "沙特阿拉伯", num: "+966" },
      { name: "圣多美与普林希比共和国", num: "+239" },
      { name: "圣基茨和尼维斯", num: "+1869" },
      { name: "圣卢西亚岛", num: "+1758" },
      { name: "圣文森特和格林纳丁斯", num: "+1784" },
      { name: "斯里兰卡", num: "+94" },
      { name: "斯洛伐克", num: "+421" },
      { name: "斯洛文尼亚", num: "+386" },
      { name: "斯威士兰", num: "+268" },
      { name: "苏里南", num: "+597" },
      { name: "所罗门群岛", num: "+667" },
      { name: "索马里", num: "+252" }
    ]
  },
  {
    title: "T",
    data: [
      { name: "塔吉克斯坦", num: "+992" },
      { name: "台湾", num: "+886" },
      { name: "泰国", num: "+66" },
      { name: "坦桑尼亚", num: "+255" },
      { name: "汤加", num: "+676" },
      { name: "特克斯和凯科斯群岛", num: "+1649" },
      { name: "特立尼达和多巴哥", num: "+1869" },
      { name: "突尼斯", num: "+216" },
      { name: "土耳其", num: "+90" },
      { name: "土库曼斯坦", num: "+993" }
    ]
  },
  {
    title: "W",
    data: [
      { name: "瓦努阿图", num: "+678" },
      { name: "危地马拉", num: "+502" },
      { name: "委内瑞拉", num: "+58" },
      { name: "文莱", num: "+673" },
      { name: "乌干达", num: "+256" },
      { name: "乌克兰", num: "+380" },
      { name: "乌拉圭", num: "+598" },
      { name: "乌兹别克斯坦", num: "+998" }
    ]
  },
  {
    title: "X",
    data: [
      { name: "西班牙", num: "+34" },
      { name: "希腊", num: "+30" },
      { name: "香港", num: "+852" },
      { name: "新加坡", num: "+65" },
      { name: "新喀里多尼亚", num: "+687" },
      { name: "新西兰", num: "+64" },
      { name: "匈牙利", num: "+36" }
    ]
  },
  {
    title: "Y",
    data: [
      { name: "牙买加", num: "+1876" },
      { name: "亚美尼亚", num: "+374" },
      { name: "也门", num: "+967" },
      { name: "伊拉克", num: "+964" },
      { name: "以色列", num: "+972" },
      { name: "意大利", num: "+39" },
      { name: "印度", num: "+91" },
      { name: "印度尼西亚", num: "+62" },
      { name: "英国", num: "+44" },
      { name: "英属维尔京群岛", num: "+1809" },
      { name: "约旦", num: "+962" },
      { name: "越南", num: "+84" }
    ]
  },
  {
    title: "Z",
    data: [
      { name: "赞比亚", num: "+260" },
      { name: "乍得", num: "+235" },
      { name: "直布罗陀", num: "+350" },
      { name: "智利", num: "+56" },
      { name: "中非共和国", num: "+236" },
      { name: "中国", num: "+86" }
    ]
  }
];
export default countryData;
