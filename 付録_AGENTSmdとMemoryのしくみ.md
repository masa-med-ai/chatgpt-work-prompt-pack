# 付録 — AGENTS.md、Project、Personalization、Memoryのしくみ

ChatGPTへ渡す情報は、保存期間と適用範囲で置き場所を選ぶ。

| しくみ | 適用範囲 | 主な用途 | 注意 |
|---|---|---|---|
| 今のチャット | その会話 | 今回だけの目的・制約 | 別チャットには自動で引き継がれない |
| ChatGPT Project | Project内のチャット | 共通のSourcesとProject instructions | PCのローカルフォルダへ直接アクセスする仕組みではない |
| ローカルProject | 添付したPC上のフォルダ | ファイル編集、ローカル作業 | primary folderが基準 |
| `AGENTS.md` | そのフォルダ／リポジトリ | 作業規則、検証方法、コマンド | ファイルとして残る |
| Personalization | 複数のチャット | 文体や回答の好み | Settingsで管理 |
| Memory | 複数のチャット | 過去の会話から得た有用な文脈 | 利用可否は設定・プランに依存 |
| Skill | 目的に合う依頼 | 再利用可能な作業手順・資料 | 導入前に内容と権限を確認 |

## AGENTS.md

ローカルProjectやリポジトリに置く、ChatGPT／Codex向けの明示的な作業指示である。回答の文体だけでなく、ファイルの置き場所、テスト方法、外部書き込み前の確認など、作業に必要な規則を書く。

このパックの`AGENTS.md`には、1ステップずつ進めること、成果物を`workshop_output/`へ保存すること、医療安全、外部サービス書き込み前の承認が書かれている。

フォルダ階層に複数の`AGENTS.md`がある場合は、対象ファイルに近い指示ほど具体的な規則として扱われる。矛盾させず、詳細だけを下位へ足す。

## Project instructionsとSources

同じProjectの複数チャットで共有したい背景や資料に向く。Web上のChatGPT Projectは、アップロードしたファイルや接続済みSourcesを共有する。ローカルProjectはPC上のフォルダを作業対象にできる。

## PersonalizationとMemory

Personalizationは自分が明示的に設定する好みである。Memoryは利用可能な場合に、過去の会話から役立つ文脈を持ち越す機能である。

どちらにも患者情報、パスワード、APIキー、機密情報を保存しない。重要な業務規則はMemory任せにせず、確認できる`AGENTS.md`、Project instructions、Skillへ明示する。

## Persona.md

`Persona.md`はOpenAI製品の特別な予約ファイルではない。職業、読者、文体、避ける表現などを人が読める形で保存し、必要なチャットで参照させるための教材上の方法である。

適用範囲を自分で選べ、内容をレビューしやすい。Level 2ではこれを正本として使う。

## 早見

- 今回だけ → チャット
- Project全体の資料や背景 → Project instructions／Sources
- ローカルファイル作業の規則 → `AGENTS.md`
- 個人の回答の好み → Personalization
- 再利用可能な作業手順 → Skill
- 明示的に持ち運べる人物・文体設定 → `Persona.md`

これらは権限を広げる仕組みではない。ファイル、Web、外部サービスへのアクセスは、Plugin、sandbox、approval、管理者設定の範囲内で行われる。
