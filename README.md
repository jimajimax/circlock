# circlock
円を表す"circle"と時計の"clock"を合わせた造語です。

現在の時刻を西暦、月、日、曜日、時、分、秒で表示します。秒は円周上を動きます。
JavaScriptの`Date.get`メソッドを使用しているため時刻はサーバー取得ではなく、クライアント側のローカルタイムを取得しています。そのためデバイスの時刻のずれなどによって表示される時刻が実際の正確な時刻とは異なる場合があります。
なのでデバイス側の時刻を正確にすることを推奨します。「[参考：時刻の合わせ方](https://jjy.nict.go.jp/ntp/)」

```javascript
const time = new Date()

    time.getFullYear()
    ("0" + (time.getMonth() + 1)).slice(-2)
    ("0" + time.getDate()).slice(-2) + "日"
    const day = time.getDay()
    ["日", "月", "火", "水", "木", "金", "土"][day] + "曜日";
    ("0" +  time.getHours()).slice(-2)
    ("0" +  time.getMinutes()).slice(-2)
    ("0" +  time.getSeconds()).slice(-2)
```
取得した値の左に0を足し、sliceで値を右から表示することで0埋めをして常に2桁になるようにしてます
<br><br>



# Document Picture-in-Picture API
正直これを使いたかった。

`Document Picture-in-Picture API`とはChromeでは2023年8月に116で追加された`video`要素以外にもPicture-in-Picture(PiP)出来るようにしたものです。
PiPを使えば常にウィンドウを最前面表示にできるので動画以外にも使えるようになったのはめちゃめちゃ嬉しいですよね

```javascript
   pipButton.addEventListener("click", async () => {
     // PiP Windowに追加したい要素
     const player = document.querySelector("#");

     // PiP Windowを開く
     const pipWindow = await documentPictureInPicture.requestWindow(options);

     // 要素をPiP Windowに追加
     pipWindow.document.body.append(player);
   });
```
Qiitaに書きました[Document Picture-in-Picture APIを使ってみた 【JavaScript】](https://qiita.com/jimajimax/items/c72fff01b21d208383ec)もご覧下さい
<br><br>



## First Load メッセージ
アクセス時に表示されるアレです。
<br>
<table>
  <tr>
    <td><img src="https://jimajimax.github.io/circlock/img/firstLoad.png" alt="横" width="430"></td>
    <td></td>
    <td><img src="https://jimajimax.github.io/circlock/img/firstLoad_tate.png" alt="縦" width="170"></td>
  </tr>
</table>

<br>
後述したlocalStorageにtrueやfalseを保存してリロード時や再アクセス時に表示しなくするようにしてます

```javascript
    if (circlock_savedLoadChecked == null) {
        loadCheck.checked = true; // 最初はスイッチをonにしてメッセージを表示
    }

    if (loadCheck.checked) {
        // スイッチがonの時trueを保存
        localStorage.setItem("circlock_savedLoadChecked", "true");
    } else {
        // スイッチがoffの時falseを保存
        localStorage.setItem("circlock_savedLoadChecked", "false");
    }

    if (circlock_savedLoadChecked !== "true") {
        // true以外の時メッセージを表示する
        loadOverlayOpen();

        loadCloseBtn.addEventListener("click", () => {
        loadOverlayClose();
        })
    }
```
<br>



## localStorage

ページでは最大で7種類の情報をlocalStoregeに保存しています。

- Key: circlock_lastVisitUnix
- Key: circlock_lastVisitDate
- Key: circlock_savedLoadChecked
- Key: circlock_savedColor
- Key: circlock_savedBgColor
- Key: circlock_savedContentColor
- Key: circlock_streak

<br>　それぞれ順番に
- 最後に更新したUNIXミリ秒
- 最後に更新した日時 YYYY-MM-DD ddd HH:MM:SS
- FirstLoadを再度表示するかどうか
- 色を保存しているかどうか
- 背景の色のHEX
- 時計の色のHEX
- 連続日数


デバイスのローカルタイムが変わっても良いようにUNIX時間を使用し、現在のUNIX時間との差で前回の更新時間からの日時を計算しています。

また訪問日時やstreakはページ更新時に保存されるので日付が変わったあとページを更新しないとカウントされません
<br><br>

以下のブックマークレットをアドレスバーに打ち、実行することでそのドメインに保存されているlocalStorageを`alert`で表示できます。コンソールに出したい方はconsole.logにしてください
```javascript
javascript:(function(){let items="";for(let i=0;i<localStorage.length;i++){let key=localStorage.key(i);let value=localStorage.getItem(key);items+=`Key:${key},Value:${value}\n`;}alert(items||"localStorageは空です");})();
```
<br><br>

localStorageは数値を保存しようとしても文字列として保存されるので取り出す際も文字列になるのですが、JavaScriptでは文字列と数値を組み合わせて演算を行う際に、型変換が行われることがあるので四則演算は出来ます。

しかし`+=`を使用して数を足したいとき、文字列に数値を足すことになるので文字列として結合されます。なので `Number` で数値に変換し計算します。

```javascript
let streak = Number(localStorage.getItem("circlock_streak")); // streak数を取得し数値型に変換
streak += 1; // 連続してる場合は+1
localStorage.setItem("circlock_streak", streak); // 更新したstreak数を保存
```
localStorageは簡単に変更出来てしまい、かつサーバー側から取得することが出来ないので連続日数が多くても特に何もありません。
<br>



## ::selection

「Ctrl」+「A」(スマホは長押し)など、文字選択時に秒表示にできます

`CSS`の疑似要素`::selection`を使うと文字選択時の色を変更できるため`color`を透明にすることで消し、表示させたい色の`color: (任意の色);`にします最初は`color: transparent;`にしときます
```css
    #a(表示したい要素) *::selection {
        background-color: transparent;
        color: (任意の色);
    }

    #a {
        color: transparent;
    }

    #b(消したい要素) *::selection {
        background-color: transparent;
        color: transparent;
    }
```


<br>

## 色を自分で決める

`HTML`の`input type="color"`を使ってます

先にどちらの色を選択しても背景と時計の色が自動で変わるようにしてます
```html
    <label><input type="color" value="#112244" id="bgColor" list>背景の色</label>
    <label><input type="color" value="#ffffff" id="contentColor" list>時計の色</label>
```

```javascript
    bgColor.addEventListener("input", (event) => {
        // 選択された色をroot要素にセット
        document.documentElement.style.setProperty("--bgColor", event.target.value);
        document.documentElement.style.setProperty("--contentColor", contentColor.value);
    });

    contentColor.addEventListener("input", (event) => {
        // 選択された色をroot要素にセット
        document.documentElement.style.setProperty("--contentColor", event.target.value);
        document.documentElement.style.setProperty("--bgColor", bgColor.value);
    });
```



## その他
PiP実行中はページタイトルが変わるという細かい仕様もあります。
```javascript
   document.title = "circlock | Webデジタル時計"; // タイトル
   document.title = "circlock | PiP"; // PiP実行中のタイトル
```
<br>



### Links
- [Document PiP APIについて](https://developer.chrome.com/docs/web-platform/document-picture-in-picture?hl=ja)
- [作成したページはこちら](https://jimajimax.github.io/circlock/)
- [国立研究開発法人情報通信研究機構](https://jjy.nict.go.jp/ntp/)
