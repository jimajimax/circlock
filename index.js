// #region commonly used const and let
   const pipBody = document.getElementById("pipBody");
   const Container = document.getElementById("Container");
   const circle = document.getElementById("circle");
   const dot = document.getElementById("dot");
   const menuBtn = document.getElementById("menuBtn");
   let pipWindow = null;
   let pipContainer = null;
// #endregion
// #region Loading
   const loadOverlay = document.getElementById("loadOverlay");
   const loadPopup = document.getElementById("loadPopup");
   const loadCircle = document.getElementById("loadCircle");
   const loadCloseBtn = document.getElementById("loadCloseBtn");
   const circlock_savedLoadChecked = localStorage.getItem("circlock_savedLoadChecked");
   const loadCheck = document.getElementById("loadCheck");

   if (circlock_savedLoadChecked == null || circlock_savedLoadChecked === "true") {
      loadCheck.checked = true;
   }

   if (circlock_savedLoadChecked !== "true") {
      window.addEventListener("load", () => {
         Container.style.display = "none";
         menuBtn.style.display = "none";
         setTimeout(() => {
            loadOverlayOpenLoad();
         }, 70)
         
         loadCloseBtn.addEventListener("click", () => {
            loadOverlayClose();
         })
      });
   }

   function loadOverlayOpenLoad() {
      loadCircle.style.display = "flex";
      loadOverlay.style.display = "flex";
      loadCircle.style.animation = "expand .95s cubic-bezier(.5, .05, .5, 1) forwards";
      
      setTimeout(() => {
            loadOverlay.style.opacity = "1";
            loadOverlay.style.transform = "scale(1)";
      }, 650)
   }

   function loadOverlayOpen() {
      loadCircle.style.display = "flex";
      loadOverlay.style.display = "flex";
      loadCircle.style.animation = "expand .5s ease-in forwards";
      
      setTimeout(() => {
            loadOverlay.style.opacity = "1";
            loadOverlay.style.transform = "scale(1)";
      }, 400)
   }

   function loadOverlayClose() {
      Container.style.display = "flex";
      menuBtn.style.display = "flex";
      setTimeout(() => {
            loadCircle.style.animation = "shrink .5s ease-out forwards";
      }, 150);

      loadOverlay.style.opacity = "0";
      loadOverlay.style.transform = "scale(0.8)";
      if (loadCheck.checked) {
            localStorage.setItem("circlock_savedLoadChecked", "true");
      } else {
            localStorage.setItem("circlock_savedLoadChecked", "false");
      }
      setTimeout(() => {
            loadOverlay.style.display = "none";
            loadCircle.style.display = "none";
      }, 650)
   }
// #endregion
// #region Access timestamp and streaks
   const visitTextDiv = document.getElementById("visitTextDiv");
   const menuVisitTextDiv = document.getElementById("menuVisitTextDiv");
   const streaks = document.getElementById("streaks");
   const menuStreaks = document.getElementById("menuStreaks");
   const lastUnix = localStorage.getItem("circlock_lastVisitUnix");
   const date = new Date();
   const nowUnix = date.getTime();
   const nowYear = date.getFullYear();
   const nowMonth = String(date.getMonth() + 1).padStart(2, "0");
   const nowDate = String(date.getDate()).padStart(2, "0");
   const nowDay = date.getDay();
   const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][nowDay];
   const nowHour = String(date.getHours()).padStart(2, "0");
   const nowMin = String(date.getMinutes()).padStart(2, "0");
   const nowSec = String(date.getSeconds()).padStart(2, "0");

   const formattedDate = nowYear + "-" + nowMonth + "-" + nowDate + " " + dayName + " " + nowHour + ":" + nowMin + ":" + nowSec;

   if (lastUnix) {
      const diff = nowUnix - lastUnix;
      const diffSec = Math.floor(diff / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHou = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHou / 24);
      const diffYea = Math.floor(diffDay / 365);

      const displaydiffSec = diffSec % 60;
      const displaydiffMin = diffMin % 60;
      const displaydiffHou = diffHou % 24;
      const displaydiffDay = diffDay % 365;

      let visitText = "おかえりなさい！👋<br>最後に開いたのは ";
      if (diffYea > 0) {
            visitText += diffYea + "年";
      }
      if (diffDay > 0 || diffYea) {
            visitText += displaydiffDay + "日";
      }
      if (diffHou > 0 || diffDay > 0) {
            visitText += displaydiffHou + "時間";
      }
      if (diffMin > 0 || diffHou > 0 || diffDay > 0) {
            visitText += displaydiffMin + "分";
      }
      if (diffSec >= 0 && diffYea === 0 && diffDay === 0 && diffHou === 0 && diffMin === 0) {
            visitText += displaydiffSec + "秒";
      }

      const formattedDate =  localStorage.getItem("circlock_lastVisitDate"); // YYYY-MM-DD ddd HH:MM:SS

      visitText += "前(" + formattedDate + ")";
      visitTextDiv.innerHTML = visitText + " です";
      menuVisitTextDiv.innerHTML = visitText ;
   } else {
      visitTextDiv.textContent = "Hello! このページにアクセスするのは初めてです！";
      menuVisitTextDiv.textContent = "Hello! このページにアクセスするのは初めてです！";
   }

   // 最後に現在の訪問時間を保存
   localStorage.setItem("circlock_lastVisitUnix", nowUnix);

   // streaks
   let streak = Number(localStorage.getItem("circlock_streak")); // streak数を取得
   let reset = "";

   if (lastUnix) {
      const today = nowYear + "-" + nowMonth + "-" + nowDate; // 現在の日付 YYYY-MM-DD
      const lastDate = localStorage.getItem("circlock_lastVisitDate").split(" ")[0]; // 前回保存の日付 YYYY-MM-DD
      const lastDateObj = new Date(lastDate); // 一時変換 yyyy-mm-ddThh:mm:ss.sssZ
      lastDateObj.setDate(lastDateObj.getDate() + 1); // +1日したunix time
      const lastDateAdd1 = lastDateObj.toISOString().split("T")[0]; // lastDateに+1日した日付 YYYY-MM-DD

      if (lastDateAdd1 === today) {
            streak += 1; // 連続してる場合+1
      } else if (lastDate === today) {
            // 既に今日ページを更新している場合
      } else {
            // 連続跡切れ
            reset = "記録はリセットされました...";
            streak = 1;
      }

   } else {
      streak = 1; // 初回記録
   }

   // 更新内容を保存
   localStorage.setItem("circlock_lastVisitDate", formattedDate);
   localStorage.setItem("circlock_streak", streak);
   streaks.textContent = "連続" + reset + streak + "日目です！明日も来るとカウントが増えますよ！";
   menuStreaks.textContent = "連続" + reset + streak + "日目です！明日も来るとカウントが増えますよ！";
// #endregion
// #region menu loadOverlay
   const settings = document.getElementById("settings");
   const about = document.getElementById("about");
   const messageSwitch = document.getElementById("messageSwitch");
   const welcome = document.getElementById("welcome");
   let aboutOpen = false;

   about.addEventListener("click", () => {
      loadOverlayOpen();
      welcome.textContent = "Information";
      welcome.style.fontSize = "37px";
      messageSwitch.innerHTML = "ロード時にこのメッセージを表示しない<br>(再度変更できます)";
      loadCloseBtn.textContent = "Close";
      about.style.opacity = "0";
      aboutOpen = true;
      setTimeout(() => {
      about.style.display = "none";
      settings.style.display = "none";
      menuBtn.style.display = "none";
      if (!ispip) {
            Container.style.display = "none";
      }
      }, 500)
   });

   loadCloseBtn.addEventListener("click", () => {
      loadOverlayClose();
      if (aboutOpen) {
            settings.style.display = "flex";
            about.style.display = "flex";

            setTimeout(() => {
               about.style.display = "block";
               }, 500)

            setTimeout(() => {
            about.style.opacity = "1";
            }, 600)
            aboutOpen = false;
      }
   });
// #endregion
// #region menu open close
   const mask = document.getElementById("mask");
   const menu = document.getElementById("menu");
   let onMenuWidth, minOnMenuDimension, onMenuScale, translateXValue;
   let onMenuResize = false; // menuopen状態はresizeを無効に

   function onMenuAdjustValue() {
      onMenuWidth = window.innerWidth - 302;
      minOnMenuDimension = Math.min(onMenuWidth, window.innerHeight);
      onMenuScale = minOnMenuDimension * 0.003;
      translateXValue = 150 / onMenuScale
   }
   onMenuAdjustValue();
   window.addEventListener("resize", onMenuAdjustValue);

   function onMenuAdjust() {
      if (!onMenuResize) {
            menuBtn.classList.toggle("open");
            menu.classList.toggle("open");
            mask.classList.toggle("open");
            settings.style.display = "flex";
            about.style.display = "block";
            onMenuResize = true;
      }

      if (!ispip) {
            if (minOnMenuDimension > 0 && minOnMenuDimension < 300) {
               Container.style.transform = "translate(-50%, -50%) scale(" + onMenuScale
                  + ") translateX(" + translateXValue + "px)";
            } else if (minOnMenuDimension <= 0) {
               Container.style.transform = "translate(-50%, -50%) scale(0.177) translateX(847.5px)";
            } else {
               Container.style.transform = "translate(-50%, -50%) scale(1) translateX(150px)";
            }
      }

   }
   menuBtn.addEventListener("click", onMenuAdjust);

   mask.addEventListener("click", () => {
      menuBtn.classList.remove("open");
      menu.classList.remove("open");
      Container.classList.remove("open");
      mask.classList.remove("open");
      onMenuResize = false;
      if (!ispip) {
            adjustScale();
      }

      setTimeout(() => {
            settings.style.display = "none";
            about.style.display = "none";
      }, 150);
   });
// #endregion
// #region aria-expanded
   const selfColorBtn = document.getElementById("selfColorBtn");

   selfColorBtn.addEventListener("click", () => {
      // aria-expandedの値を切り替え
      const expanded = selfColorBtn.getAttribute("aria-expanded") === "true";
      selfColorBtn.setAttribute("aria-expanded", !expanded);
      if (!expanded){
            selfColorBtn.title = "クリックで閉じる";
      } else {
            selfColorBtn.title = "クリックで開く";
      }
   });
// #endregion
// #region selection
   function selectionColor(color) {
      const style = document.createElement("style");
      style.innerHTML = "::selection {" + "color: " + color + "; " + "background-color: transparent;" + "}";
      document.head.appendChild(style);
   }
// #endregion
// #region selfColor
   const bgColor = document.getElementById("bgColor");
   const contentColor = document.getElementById("contentColor");
   const circlock_savedBgColor = localStorage.getItem("circlock_savedBgColor");
   const circlock_savedContentColor = localStorage.getItem("circlock_savedContentColor");
   const circlock_savedColor = localStorage.getItem("circlock_savedColor");
   const sampleSaved = document.getElementById("sampleSaved");
   const sampleInput = document.getElementById("sampleInput");
   const rootStyles = getComputedStyle(document.documentElement);

   if (circlock_savedColor === "true") {
      sampleSaved.style.backgroundColor = circlock_savedBgColor;
      sampleSaved.style.color = circlock_savedContentColor;
      document.getElementById("savedText").style.display = "flex";
   } else {
      sampleSaved.textContent = "色を保存していません";
      sampleSaved.style.color = "#ccc";
      sampleSaved.style.border = "none";
      sampleSaved.style.width = "150px";
      sampleSaved.style.fontSize = "15px";
   }

   bgColor.addEventListener("input", (event) => {
      // 選択された色をroot要素にセット
      document.documentElement.style.setProperty("--bgColor", event.target.value);
      document.documentElement.style.setProperty("--contentColor", contentColor.value);
      const inputBgColor = rootStyles.getPropertyValue("--bgColor").trim();
      const inputContentColor = rootStyles.getPropertyValue("--contentColor").trim();
      MetaThemeColor.setAttribute("content", event.target.value);
      pipBody.style.backgroundColor = event.target.value;
      Container.style.color = contentColor.value;
      circle.style.borderColor = contentColor.value;
      dot.style.backgroundColor = contentColor.value;
      selectionColor(contentColor.value);
      if (ispip) {
            pipWindow.postMessage(
            { type: "selectionChange",
            color: contentColor.value},
            "*"
            );
      }

      sampleInput.style.backgroundColor = inputBgColor;
      sampleInput.style.color = inputContentColor;
      document.querySelectorAll(".colorSwitch").forEach((checkbox) => {
            checkbox.checked = false;
      });
      selfColorSwitch.checked = true;
      whichSwitch = "5";
   });

   contentColor.addEventListener("input", (event) => {
      // 選択された色をroot要素にセット
      document.documentElement.style.setProperty("--contentColor", event.target.value);
      document.documentElement.style.setProperty("--bgColor", bgColor.value);
      const inputContentColor = rootStyles.getPropertyValue("--contentColor").trim();
      const inputBgColor = rootStyles.getPropertyValue("--bgColor").trim();
      pipBody.style.backgroundColor = bgColor.value;
      Container.style.color = event.target.value;
      circle.style.borderColor = event.target.value;
      dot.style.backgroundColor = event.target.value;
      selectionColor(contentColor.value);
      if (ispip) {
            pipWindow.postMessage(
            { type: "selectionChange",
            color: contentColor.value},
            "*"
            );
      }

      sampleInput.style.color =  inputContentColor;
      sampleInput.style.backgroundColor = inputBgColor;
      document.querySelectorAll(".colorSwitch").forEach((checkbox) => {
            checkbox.checked = false;
      });
      selfColorSwitch.checked = true;
      whichSwitch = "5";
   });
// #endregion
// #region save and delete
   const saveBtn = document.getElementById("saveBtn");
   const deleteBtn = document.getElementById("deleteBtn");
   const bgColorInput = document.getElementById("bgColor");
   const contentColorInput = document.getElementById("contentColor");
   const saveColorSwitch = document.getElementById("saveColorSwitch");
   const selfColorSwitch = document.getElementById("selfColorSwitch");
   // 保存ボタンの処理
   saveBtn.addEventListener("click", function () {

      var savecomfirm = confirm("保存しますか？\n(既に保存している色がある場合は上書きされます)");

      if (savecomfirm) {
            const bgColor = bgColorInput.value;
            const contentColor = contentColorInput.value;

            localStorage.setItem("circlock_savedBgColor", bgColor);
            localStorage.setItem("circlock_savedContentColor", contentColor);
            localStorage.setItem("circlock_savedColor", "true");
            const circlock_savedBgColor = localStorage.getItem("circlock_savedBgColor");
            const circlock_savedContentColor = localStorage.getItem("circlock_savedContentColor");

            document.getElementById("savedText").style.display = "flex";
            sampleSaved.textContent = "色見本";
            sampleSaved.style.backgroundColor = circlock_savedBgColor;
            sampleSaved.style.color = circlock_savedContentColor;
            sampleSaved.style.width = "32px";
            sampleSaved.style.height = "32px";
            sampleSaved.style.border = "solid 1px #bbb";
            sampleSaved.style.fontSize = "9px";
            sampleSaved.style.borderRadius = "15%";
            sampleSaved.style.display = "flex";
            sampleSaved.style.alignItems = "center";
            sampleSaved.style.justifyContent = "center";
            alert("保存しました");
      } else {
            alert("保存をキャンセルしました");
      }
   });
   // 削除ボタンの処理
   deleteBtn.addEventListener("click", function () {
      const circlock_savedColor = localStorage.getItem("circlock_savedColor");

      if (circlock_savedColor === "true") {
            var deletecomfirm = confirm("削除しますか？");

            if (deletecomfirm) {
               localStorage.removeItem("circlock_savedBgColor");
               localStorage.removeItem("circlock_savedContentColor");
               localStorage.setItem("circlock_savedColor", "false");

               sampleSaved.textContent = "色を保存していません";
               sampleSaved.style.color = "#ccc";
               sampleSaved.style.backgroundColor = "#222";
               sampleSaved.style.border = "none";
               sampleSaved.style.width = "150px";
               sampleSaved.style.fontSize = "15px";
               document.getElementById("savedText").style.display = "none";
               alert("削除しました");

               if (saveColorSwitch.checked) {
                  document.documentElement.style.setProperty("--bgColor", "#333");
                  document.documentElement.style.setProperty("--contentColor", "#ed8");
                  pipBody.style.backgroundColor = "#333";
                  Container.style.color = "#ed8";
                  circle.style.borderColor = "#ed8";
                  dot.style.backgroundColor = "#ed8";
                  selectionColor("#ed8");
                  if (ispip) {
                        pipWindow.postMessage(
                        { type: "selectionChange",
                        color: "#ed8"},
                        "*"
                        );
                  }
                  MetaThemeColor.setAttribute("content", "#333");

                  saveColorSwitch.checked = false;
                  switch0.checked = true;
                  whichSwitch = "0";
               }
            } else {
               alert("削除をキャンセルしました");
            }
      } else {
      alert("色が見つかりませんでした");
      }
   });
// #endregion
// #region get HEX
   const getHEXBtn = document.getElementById("getHEXBtn");
   getHEXBtn.addEventListener("click", () => {
      const bgHEX =  getComputedStyle(document.documentElement).getPropertyValue("--bgColor");
      const contentHEX = getComputedStyle(document.documentElement).getPropertyValue("--contentColor");
      alert("現在表示している色のカラーコードHEX値\n背景の色: " + bgHEX + "\n時計の色: " + contentHEX);
   });
// #endregion
// #region switch
   // スイッチを取得
   const switches = document.querySelectorAll(".colorSwitch");
   const MetaThemeColor = document.querySelector('meta[name="theme-color"]');
   let whichSwitch = "0";

   // ページ読み込み時にスイッチAをON
   document.getElementById("switch0").checked = true;

   // スイッチが変更された時に実行される関数
   switches.forEach((switchElem, index) => {

      switchElem.addEventListener("change", function () {
            // 現在ONのスイッチの数をカウント
            const checkedCount = Array.from(switches).filter(switchElem => switchElem.checked).length;

            // すべてOFFにしようとした場合は操作をキャンセル
            if (checkedCount === 0) {
               this.checked = true;
               return;
            }

            if (this.checked) {
               // 他のスイッチを全てOFFにする
               switches.forEach((otherSwitch, otherIndex) => {
                  if (otherIndex !== index) {
                        otherSwitch.checked = false;
                  }
               });

               if (index === 0) {
                  document.documentElement.style.setProperty("--bgColor", "#333");
                  document.documentElement.style.setProperty("--contentColor", "#ed8");
                  pipBody.style.backgroundColor = "#333";
                  Container.style.color = "#ed8";
                  circle.style.borderColor = "#ed8";
                  dot.style.backgroundColor = "#ed8";
                  selectionColor("#ed8");
                  if (ispip) {
                        pipWindow.postMessage(
                        { type: "selectionChange",
                        color: "#ed8"},
                        "*"
                        );
                  }
                  MetaThemeColor.setAttribute("content", "#333");
                  whichSwitch = "0";

               } else if (index === 1) {
                  document.documentElement.style.setProperty("--bgColor", "#000");
                  document.documentElement.style.setProperty("--contentColor", "#fff");
                  pipBody.style.backgroundColor = "#000";
                  Container.style.color = "#fff";
                  circle.style.borderColor = "#fff";
                  dot.style.backgroundColor = "#fff";
                  selectionColor("#fff");
                  if (ispip) {
                        pipWindow.postMessage(
                        { type: "selectionChange",
                        color: "#fff"},
                        "*"
                        );
                  }
                  MetaThemeColor.setAttribute("content", "#000");
                  whichSwitch = "1";

               } else if (index === 2) {
                  document.documentElement.style.setProperty("--bgColor", "#fff");
                  document.documentElement.style.setProperty("--contentColor", "#000");
                  pipBody.style.backgroundColor = "#fff";
                  Container.style.color = "#000";
                  circle.style.borderColor = "#000";
                  dot.style.backgroundColor = "#000";
                  selectionColor("#000");
                  if (ispip) {
                        pipWindow.postMessage(
                        { type: "selectionChange",
                        color: "#000"},
                        "*"
                        );
                  }
                  MetaThemeColor.setAttribute("content", "#fff");
                  whichSwitch = "2";

               } else if (index === 3) {
                  document.documentElement.style.setProperty("--bgColor", "#aaa");
                  document.documentElement.style.setProperty("--contentColor", "#333");
                  pipBody.style.backgroundColor = "#aaa";
                  Container.style.color = "#333";
                  circle.style.borderColor = "#333";
                  dot.style.backgroundColor = "#333";
                  selectionColor("#333");
                  if (ispip) {
                        pipWindow.postMessage(
                        { type: "selectionChange",
                        color: "#333"},
                        "*"
                        );
                  }
                  MetaThemeColor.setAttribute("content", "#aaa");
                  whichSwitch = "3";

               } else if (index === 4) {
                  const circlock_savedColor = localStorage.getItem("circlock_savedColor");
                  if (circlock_savedColor === "true") {
                        const circlock_savedBgColor = localStorage.getItem("circlock_savedBgColor");
                        const circlock_savedContentColor = localStorage.getItem("circlock_savedContentColor");
                        document.documentElement.style.setProperty("--bgColor", circlock_savedBgColor);
                        document.documentElement.style.setProperty("--contentColor", circlock_savedContentColor);
                        MetaThemeColor.setAttribute("content", circlock_savedBgColor);
                        pipBody.style.backgroundColor = circlock_savedBgColor;
                        Container.style.color = circlock_savedContentColor;
                        circle.style.borderColor = circlock_savedContentColor;
                        dot.style.backgroundColor = circlock_savedContentColor;
                        selectionColor(circlock_savedContentColor);
                        if (ispip) {
                        pipWindow.postMessage(
                        { type: "selectionChange",
                        color: circlock_savedContentColor},
                        "*"
                        );
                  }
                        MetaThemeColor.setAttribute("content", circlock_savedBgColor);
                  } else {
                        alert("色が見つかりませんでした\n色を保存してからお試し下さい");
                        this.checked = false;

                        if (whichSwitch === "0") {
                           document.getElementById("switch0").checked = true;
                        } else if (whichSwitch === "1") {
                           document.getElementById("switch1").checked = true;
                        } else if (whichSwitch === "2") {
                           document.getElementById("switch2").checked = true;
                        } else if (whichSwitch === "3") {
                           document.getElementById("switch3").checked = true;
                        } else if (whichSwitch === "5") {
                           selfColorSwitch.checked = true;
                        }
                        selfColorBtn.setAttribute("aria-expanded", true);
                        selfColorBtn.title = "クリックで閉じる";
                  }

               } else if (index === 5) {
                  document.documentElement.style.setProperty("--bgColor", bgColor.value);
                  document.documentElement.style.setProperty("--contentColor", contentColor.value);
                  MetaThemeColor.setAttribute("content", bgColor.value);
                  pipBody.style.backgroundColor = bgColor.value;
                  Container.style.color = contentColor.value;
                  circle.style.borderColor = contentColor.value;
                  dot.style.backgroundColor = contentColor.value;
                  selectionColor(contentColor.value);
                  if (ispip) {
                        pipWindow.postMessage(
                        { type: "selectionChange",
                        color: contentColor.value},
                        "*"
                        );
                  }
                  whichSwitch = "5";

               }
            }
      });
   });
// #endregion
// #region menuBtnTransparent
   let menuBtnSpansCheck = false;
   const menuBtnSpans = document.querySelectorAll("#menuBtn span");
   const menuBtnBtn = document.getElementById("menuBtnBtn");

   function toggleMenuBtnSpans() {
      menuBtnSpans.forEach(span => {
            const colorValue = getComputedStyle(document.documentElement).getPropertyValue("--contentColor").trim();
            if (!menuBtnSpansCheck) {
               span.style.backgroundColor = "transparent";
               circle.title = "メニューボタンを表示する";

               menuBtn.addEventListener("mouseenter", () => {
                  const colorValue = getComputedStyle(document.documentElement).getPropertyValue("--contentColor").trim();
                  span.style.backgroundColor = colorValue;
               });
               menuBtn.addEventListener("mouseleave", () => {
                  span.style.backgroundColor = "transparent";

               });
            } else {
               circle.title = "メニューボタンを隠す";

               menuBtn.addEventListener("mouseleave", () => {
               const colorValue = getComputedStyle(document.documentElement).getPropertyValue("--contentColor").trim();
                  span.style.backgroundColor = colorValue;

               });
               span.style.backgroundColor = colorValue;
            }
      });

      menuBtnBtn.checked = !menuBtnSpansCheck;
      menuBtnSpansCheck = !menuBtnSpansCheck;
   }

   menuBtnBtn.addEventListener("click", toggleMenuBtnSpans);
   circle.addEventListener("click", toggleMenuBtnSpans);
// #endregion
// #region loading and adjustScale
   function adjustScale() {
      const minDimension = Math.min(window.innerWidth, window.innerHeight); // 画面の幅と高さのうち小さい方を取得

      // 小さい方のサイズを基にスケールを計算
      if (minDimension < 300) {
            const scale = minDimension * 0.003;
            Container.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
      } else {
            Container.style.transform = "translate(-50%, -50%) scale(1)";
      }
   }
   window.addEventListener("load", () => {
      const minDimension = Math.min(window.innerWidth, window.innerHeight); // 再計算

      if (minDimension < 300) {
            const scale = minDimension * 0.003;
            Container.style.transform = "translate(-50%, -50%) scale(" + 1.2 * scale + ")";
      } else {
            Container.style.transform = "translate(-50%, -50%) scale(1.3)";
      }
      Container.style.opacity = "1";
      setTimeout(adjustScale, 400);
   });
   window.addEventListener("resize", () => {
      if (!onMenuResize && !ispip) {
            adjustScale();
      }
   });
// #endregion
// #region FullScreen
   const FullScreenBtn = document.getElementById("FullScreenBtn");

   FullScreenBtn.addEventListener("change", () => {
      if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
      } else {
            document.exitFullscreen();
      }
   });
   // ボタン以外の操作で行われた場合のswitchの動作
   document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
            FullScreenBtn.checked = true;
      } else {
            FullScreenBtn.checked = false;
      }
   });
// #endregion
// #region DotPosition
   const secBox = document.getElementById("secBox");

   function DotPosition() {
      const time = new Date();
      const seconds = ("0" + time.getSeconds()).slice(-2);

      secBox.textContent = seconds;

      // 円の中心座標
      const centerX = 140;
      const centerY = 140;

      // 円の半径 (borderの厚さを考慮)
      const radius = 141;

      // 秒を角度に変換（0秒が真上に来るようにするため -90度）
      const angle = ((seconds / 60) * 360) - 90;

      // ラジアンに変換
      const radians = angle * (Math.PI / 180);

      // X, Y座標を計算 (dotを円周上にするため -5)
      const x = centerX + radius * Math.cos(radians) - 5;
      const y = centerY + radius * Math.sin(radians) - 5;

      // dotを円周上に配置
      dot.style.left = x + "px";
      dot.style.top = y + "px";
   }
   setInterval(DotPosition, 0);
// #endregion
// #region CurrentTime
   const houminBox = document.getElementById("houminBox");
   const datedayBox = document.getElementById("datedayBox");

   function CurrentTime() {
      const time = new Date()
      const date =
            time.getFullYear() + "年" +
            ("0" + (time.getMonth() + 1)).slice(-2) + "月" +
            ("0" + time.getDate()).slice(-2) + "日"; // 西暦,月,日 一桁の時に0埋め
      const day =
            (time.getDay())
      const dayName =
            ["日", "月", "火", "水", "木", "金", "土"][day] + "曜日"; // 曜日を対応させる

      const houmin =
            ("0" + time.getHours()).slice(-2) + ":" +
            ("0" + time.getMinutes()).slice(-2); // 時,分 一桁の時に0埋め

      houminBox.textContent = houmin;
      datedayBox.textContent = date + " " + dayName;
   };
   setInterval(CurrentTime, 0);
// #endregion
// #region Picture-in-Picture
   const pipButton = document.getElementById("pipBtn");
   let ispip = false;

   if ("documentPictureInPicture" in window) {
      // document PiP APIが利用可能な場合の処理

      // openの処理
      async function OpenPiP() {
            const player = document.querySelector("#pipBody");
            pipContainer = player.parentNode;

            pipWindow = await documentPictureInPicture.requestWindow({
               disallowReturnToOpener: true,
               width: 300,
               height: 250
            });

            [...document.styleSheets].forEach((styleSheet) => {
               try {
                  const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join("");
                  const style = document.createElement("style");

                  style.textContent = cssRules;
                  pipWindow.document.head.appendChild(style);
               } catch (e) {
                  const link = document.createElement("link");

                  link.rel = "stylesheet";
                  link.type = styleSheet.type;
                  link.media = styleSheet.media;
                  link.href = styleSheet.href;
                  pipWindow.document.head.appendChild(link);
               }
            });

            pipWindow.document.body.append(player);
            document.getElementById("pipactive").textContent = "Picture in Picture Mode Is Active Now";
            document.title = "circlock | PiP";
            player.style.height = "100vh";
            Container.style.transform = "translate(-50%, -50%) scale(0.7)";
            ispip = true;

            // PiPウィンドウ内でメッセージを受信
            const selctionScript = pipWindow.document.createElement("script");
            selctionScript.textContent = `
            window.addEventListener("message", (event) => {
               if (event.data.type === "selectionChange") {
               const { color } = event.data;

               // 動的に::selectionのスタイルを更新
               const selectionStyle = document.createElement("style");
               selectionStyle.textContent = \`
                  ::selection {
                        color: \${color};
                  }
               \`;
               document.head.appendChild(selectionStyle);
               }
            });
            `;
            pipWindow.document.body.appendChild(selctionScript);

            // PiPウインドウ上の×を押された時のClose処理
            pipWindow.addEventListener("unload", ClosePiP.bind(pipWindow), {
               once: true
            });
      }

      // closeの処理
      function ClosePiP() {
            if (this !== pipWindow) {
               return;
            }
            const player = pipWindow.document.querySelector("#pipBody");
            pipContainer.append(player);
            pipWindow.close();
            document.getElementById("pipactive").textContent = "";
            document.title = "circlock | Webデジタル時計";
            ispip = false;
            pipButton.checked = false;
            player.style.height = "100%";
            pipWindow = null;
            pipContainer = null;
            if (onMenuResize) {
               onMenuAdjustValue();
               onMenuAdjust();
            } else {
               adjustScale()
            }
      }

      // クリックで実行
      pipButton.addEventListener("change", () => {
            if (!pipWindow) {
               OpenPiP();
            } else {
               ClosePiP.bind(pipWindow)();
            }
      });

   } else if (document.pictureInPictureEnabled) {
      // canvas描画後に、videoでPiPが利用可能な場合の処理
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      const scaleFactor = 3;
      canvas.width = 300 * scaleFactor;
      canvas.height = 300 * scaleFactor;
      canvas.style.width = "300px";
      canvas.style.height = "300px";
      ctx.scale(scaleFactor, scaleFactor);

      const stream = canvas.captureStream(30);
      const video = document.createElement("video");
      video.srcObject = stream;

      function drawClock() {
            const time = new Date();
            const seconds = time.getSeconds();
            const minutes = time.getMinutes();
            const hours = time.getHours();
            const rootStyles = getComputedStyle(document.documentElement);
            const canvasColor = rootStyles.getPropertyValue("--contentColor").trim();
            const canvasBgColor = rootStyles.getPropertyValue("--bgColor").trim();

            // 背景
            ctx.fillStyle = canvasBgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 外枠
            ctx.strokeStyle = canvasColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(150, 150, 140, 0, Math.PI * 2);
            ctx.stroke();

            // 秒針の点
            const radius = 140;
            const angle = ((seconds / 60) * 360 - 90) * (Math.PI / 180);
            const x = 150 + radius * Math.cos(angle);
            const y = 150 + radius * Math.sin(angle);
            ctx.fillStyle = canvasColor;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();

            // 時刻
            ctx.font = "68px 'Rethink Sans'";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = canvasColor;
            const timeString = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
            ctx.fillText(timeString, 150, 145); // Y座標を設定

            // 日付
            ctx.font = "15px 'Rethink Sans', 'Kosugi'";
            const dateString =
               time.getFullYear() + "年" +
               ("0" + (time.getMonth() + 1)).slice(-2) + "月" +
               ("0" + time.getDate()).slice(-2) + "日 " +
               ["日", "月", "火", "水", "木", "金", "土"][time.getDay()] + "曜日";
            ctx.fillText(dateString, 150, 180); // Y座標を設定（行間を狭くするために調整）
      }

      setInterval(drawClock, 0);

      pipButton.addEventListener("change", async () => {
            await video.play();
            if (document.pictureInPictureElement) {
               await document.exitPictureInPicture();
               document.title = "circlock | Webデジタル時計";
            } else {
               await video.requestPictureInPicture();
               document.title = "circlock | PiP";
            }
      });

      // PiPウィンドウ上の×で閉じられたときの処理
      video.addEventListener("leavepictureinpicture", () => {
            pipButton.checked = false;
            document.title = "circlock | Webデジタル時計";
      });

   } else {
      // PiP API,canvas共に利用不可能な場合の処理
      pipButton.addEventListener("change", () => {
            alert("sorry...\nこのデバイスまたはこの環境ではPiP表示にできないみたい😭\nブラウザアプリの設定でPiPが無効になってる可能性があるよ");
            setTimeout(() => {
               pipButton.checked = false;
            }, 550);
      });
   }
// #endregion
