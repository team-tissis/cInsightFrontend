import axios from "axios";
import CRC32 from "crc-32";
import { SelectItem } from "components/shared/input";
import moment from "moment";

export const toPercent = (value: number): string => {
  return `${Math.floor(value * 100)} %`;
};

export const copyToClipboard = (element: string) => {
  const doc = document;
  const text = doc.getElementById(element);
  let range, selection;
  if (!text) {
    return;
  }
  if (window.getSelection) {
    selection = window.getSelection();
    range = doc.createRange();
    range.selectNodeContents(text);
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges();
    }
  }
};

export const zeroPadding = (num: number, length: number) => {
  return ("0000000000" + num).slice(-length);
};

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const convertPos2Str = (
  col: number,
  row: number,
  lowercase?: boolean
) => {
  const strPos = `${ALPHABET[col - 1]}${row}`;
  if (lowercase) {
    return strPos.toLowerCase();
  }
  return strPos;
};

export const convertStr2Pos = (str_position: string): number[] => {
  const alphabet = str_position[0];
  const x = Number(str_position.substring(1));
  const y = ALPHABET.indexOf(alphabet);
  return [x - 1, y];
};

export const downloadFile = (
  content: string | Uint8Array,
  filename: string,
  contentType: string
) => {
  const blob = new Blob([content], { type: contentType });
  const link = document.createElement("a");
  link.download = filename; // ダウンロードファイル名称
  link.href = window.URL.createObjectURL(blob); // オブジェクト URL を生成
  link.click(); // クリックイベントを発生させる
  URL.revokeObjectURL(link.href); // オブジェクト URL を解放」
};

export const hex2rgb = (hex: string) => {
  if (hex.slice(0, 1) == "#") hex = hex.slice(1);
  if (hex.length == 3)
    hex =
      hex.slice(0, 1) +
      hex.slice(0, 1) +
      hex.slice(1, 2) +
      hex.slice(1, 2) +
      hex.slice(2, 3) +
      hex.slice(2, 3);

  return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(function (
    str
  ) {
    return parseInt(str, 16);
  });
};

export const reorder = (
  list: any[] | undefined,
  startIndex: number,
  endIndex: number
) => {
  if (!list) {
    return [];
  }
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const triggerEvent = (element: HTMLElement, event: string): boolean => {
  // IE以外
  const evt = document.createEvent("HTMLEvents");
  evt.initEvent(event, true, true); // event type, bubbling, cancelable
  return element.dispatchEvent(evt);
};

export const findAddressByZip = async (
  zip: string
): Promise<
  { prefecture?: string; city?: string; street?: string } | undefined
> => {
  const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`;
  const response = await axios.get(url);
  if (response.data.results && response.data.results.length > 0) {
    const prefecture = response.data.results[0]["address1"];
    const city = response.data.results[0]["address2"];
    const street = response.data.results[0]["address3"];
    return {
      prefecture,
      city,
      street,
    };
  }
};

export const speak = (
  text: string,
  onEnd?: () => void,
  pitch?: number,
  rate?: number
) => {
  const speak = new SpeechSynthesisUtterance();
  speak.text = text;
  speak.rate = rate ?? 1; // 読み上げ速度 0.1-10 初期値:1 (倍速なら2, 半分の倍速なら0.5, )
  speak.pitch = pitch ?? 1; // 声の高さ 0-2 初期値:1(0で女性の声)
  speak.lang = "ja-JP"; //(日本語:ja-JP, アメリカ英語:en-US, イギリス英語:en-GB, 中国語:zh-CN, 韓国語:ko-KR)
  speak.volume = 0.5;
  if (onEnd) {
    speak.onend = onEnd;
  }
  speechSynthesis.speak(speak);
};

export const isInt = (n: any) => {
  return Number(n) === n && n % 1 === 0;
};

export const isFloat = (n: any) => {
  return Number(n) === n && n % 1 !== 0;
};

export const setPageSize = (cssPageSize: "landscape" | "portrait") => {
  const style = document.createElement("style");
  style.innerHTML = `@page {size: ${cssPageSize}}`;
  style.id = "page-orientation";
  document.head.appendChild(style);
};

export const differenceDayJa = (
  date: moment.Moment,
  target: moment.Moment = moment()
): string => {
  const diff = date.diff(target, "day");
  if (diff === 0) {
    return "今日";
  } else if (diff === -1) {
    return "昨日";
  } else if (diff === -2) {
    return "一昨日";
  } else if (diff === 1) {
    return "明日";
  } else if (diff === 2) {
    return "明後日";
  } else if (diff < 0) {
    return `${Math.abs(diff)}日前`;
  } else {
    return `${diff}日後`;
  }
};

export const zenkaku2Hankaku = (str: string) => {
  let value = str;
  const boinJa = ["あ", "い", "う", "え", "お"];
  const boinEn = ["a", "b", "c", "d", "e"];
  boinJa.map((bj, i) => {
    value = value.replace(bj, boinEn[i]);
  });
  return value.replace(/[！-～]/g, function (input) {
    return String.fromCharCode(input.charCodeAt(0) - 0xfee0);
  });
};

export const truncate = (str: string, len: number) => {
  return str.length <= len ? str : str.substr(0, len) + "...";
};

export const toDateText = (strDate?: string): string => {
  if (strDate) {
    return moment(strDate).format("YYYY/MM/DD");
  } else {
    return "-";
  }
};

export const toDateTimeText = (strDate?: string): string => {
  if (strDate) {
    return moment(strDate).format("YYYY/MM/DD HH:mm");
  } else {
    return "-";
  }
};

export const selectYears = (): SelectItem[] => {
  const currentYear = Number(moment().format("YYYY"));
  let year = 2022; // 2022からスタート
  const years = [];
  while (year <= currentYear) {
    years.push(year);
    year += 1;
  }
  return years.map((y) => {
    return { label: y + "年", value: y };
  });
};

export const selectMonth = (): SelectItem[] => {
  return new Array(12).fill(0).map((y, idx) => {
    const month = idx + 1;
    return { label: month + "月", value: month };
  });
};

export const getDaysArray = (year: number, month: number) => {
  const monthIndex = month - 1; // 0..11 instead of 1..12
  const names = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const date = new Date(year, monthIndex, 1);
  const result = [];
  while (date.getMonth() == monthIndex) {
    result.push(date.getDate());
    date.setDate(date.getDate() + 1);
  }
  return result;
};

export const swipeBack = {
  disable: () => {
    document.getElementById("html")?.classList.add("disable-swipe-back");
  },
  enable: () => {
    document.getElementById("html")?.classList.remove("disable-swipe-back");
  },
};

export const genTextColor = (text: string) => {
  const i32 = CRC32.str(text);
  const bgColor = [
    (i32 & 0xff000000) >>> 24,
    (i32 & 0x00ff0000) >>> 16,
    (i32 & 0x0000ff00) >>> 8,
    (i32 & 0x000000ff) >>> 0,
  ];
  const fontColor = [
    ~bgColor[0] & 0xff,
    ~bgColor[1] & 0xff,
    ~bgColor[2] & 0xff,
  ];
  const brightness = (r: number, g: number, b: number) => {
    return Math.floor((r * 299 + g * 587 + b * 114) / 1000);
  };

  const bgL = brightness(bgColor[0], bgColor[1], bgColor[2]);
  const fcL = brightness(fontColor[0], fontColor[1], fontColor[2]);
  if (Math.abs(bgL - fcL) < 125) {
    fontColor[0] = fontColor[1] = fontColor[2] = 0xff - bgL > bgL ? 0xff : 0x00;
  }

  const toHex = (b: number) => {
    const str = b.toString(16);
    if (2 <= str.length) {
      return str;
    }
    return "0" + str;
  };

  const toColorCode = (bytes: number[]) => {
    return "#" + toHex(bytes[0]) + toHex(bytes[1]) + toHex(bytes[2]);
  };

  return {
    fontColor: toColorCode(fontColor),
    bgColor: toColorCode(bgColor),
  };
};

export const dayOfWeekStrJP = ["日", "月", "火", "水", "木", "金", "土"];

export type DayOfWeekStrJP = typeof dayOfWeekStrJP[number];

export const getDayOfWeekJp = (date: Date): DayOfWeekStrJP => {
  return dayOfWeekStrJP[date.getDay()];
};

export const getFontColorByBackground = (backgroundColor: string) => {
  // RGBをY(輝度)に変換
  const brightness =
    parseInt(backgroundColor.substr(1, 2), 16) * 0.299 + // Red
    parseInt(backgroundColor.substr(3, 2), 16) * 0.587 + // Green
    parseInt(backgroundColor.substr(4, 2), 16) * 0.114; // Blue
  console.log(backgroundColor, brightness);
  const color = brightness >= 140 ? "#000000" : "#FFFFFF";
  return color;
};
