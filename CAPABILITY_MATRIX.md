# ChatGPT Work 機能対応表

この表は2026年7月31日時点のOpenAI公式ドキュメントを基準にした教材用の早見表である。利用可否はプラン、管理者設定、OS、インストール済みPluginで変わるため、当日は実画面で確認する。

| Level | 主な体験 | 必須 | 任意・発展 | 使えない場合 |
|---|---|---|---|---|
| 1 | ローカルファイル整理 | desktop、Work locally | なし | Webではアップロードファイルで小規模に実施 |
| 2 | Personalization／Project／AGENTS.md | ChatまたはWork | Memory | `Persona.md`だけ作る |
| 3 | Word／PDF／Excel | ローカルファイル、対応Skill | ファイル注釈 | 構成案と差し込みデータまで |
| 4 | PubMed検索・引用検証 | Web searchまたはPubMed接続 | verifier Skill、RIS | PubMed URLを手動で開く |
| 5 | Skill | `.agents/skills`を読める環境 | PubMed Plugin | SKILL.mdを直接読んで試走 |
| 6 | PowerPoint | Presentation Skill | ファイル注釈 | Markdown構成案まで |
| 7 | Sites／Browser | SitesまたはローカルHTML | Browser、Computer Use | HTML生成と手動確認 |
| 8 | Gmail→Calendar | Gmail・Google Calendar Plugins | Skill化 | ダミーメールで候補作成まで |
| 9 | Scheduled tasks | Web／desktopのScheduled | Cloud、local Project | 試走＋保存用プロンプトまで |
| 10 | Work総合 | ChatGPT desktop | Cloud、Browser、Goal | 利用可能部分だけ実施 |
| 11 | 画像＋AIアプリ | Work locally、Python環境 | Browser | 同梱サンプルを閲覧 |
| 12 | 実行形態の選択 | Chat／Work | Goal、Scheduled | 概念比較だけ実施 |

## 実行場所

| 実行場所 | 向いていること | 主な注意 |
|---|---|---|
| Chat | 質問、説明、短い下書き | 完成ファイルや長い多段階作業にはWorkを検討 |
| Work locally | PC上のファイルやアプリが必要な作業 | PCとアプリを利用可能な状態に保つ |
| Cloud | PCを閉じても続けたい作業、Web／mobileから継続 | PC上のローカルファイルへ直接アクセスできない |
| Goal | 完了条件のある長時間・多段階作業 | 権限は広がらない。必要時に承認待ちになる |
| Scheduled | 定期的な確認・更新 | 先に通常チャットで試走し、最初の数回をレビュー |

## 接続の考え方

- **Skill**は再利用可能な手順と資料である。
- **Plugin**はSkillや接続機能をまとめたインストール単位である。
- **MCP**は外部ツールをつなぐ標準であり、一般参加者は通常Plugin経由で利用する。
- ChatGPT Workでは`@`、Codexでは`$`でSkillを明示的に選べる。

## 公式資料

- [Get started with ChatGPT Work](https://learn.chatgpt.com/docs/get-started-with-work)
- [Projects and chats](https://learn.chatgpt.com/docs/projects)
- [Prompting](https://learn.chatgpt.com/docs/prompting)
- [Long-running work](https://learn.chatgpt.com/docs/long-running-work)
- [Scheduled tasks](https://learn.chatgpt.com/docs/automations)
- [Plugins](https://learn.chatgpt.com/docs/plugins)
- [Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Browser](https://learn.chatgpt.com/docs/browser)
- [Work with files](https://learn.chatgpt.com/docs/artifacts-viewer)
