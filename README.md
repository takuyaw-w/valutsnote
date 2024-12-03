# VaultNote - Secure Command-Line Memo Manager

VaultNote is a secure command-line tool for managing encrypted personal memos.
It allows you to create, view, list, and delete memos while ensuring that your
data is protected with a master password. Each memo is securely encrypted before
being stored on your device, making VaultNote an ideal choice for those who
value their privacy.

[![GitHub License](https://img.shields.io/github/license/takuyaw-w/vaultnote)](https://github.com/takuyaw-w/vaultnote/blob/main/LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/takuyaw-w/vaultnote)](https://github.com/takuyaw-w/vaultnote/releases)

## Features

- **Secure Memos**: All memos are encrypted with a master password.
- **Add, View, List, Delete**: Manage your memos from the command line.
- **Simple and Detailed Listing**: Display only memo keys or detailed memo
  information.

## Installation

To use VaultNote, please visit the
[VaultNote Releases Page](https://github.com/takuyaw-w/vaultnote/releases) and
download the appropriate version for your operating system. After downloading,
add the executable to your system PATH for easy access.

This will allow you to use the `vnote` command from anywhere on your system.

## Usage

VaultNote is operated via various commands that interact with your secure memo
storage.

### Initialize VaultNote

Before using VaultNote, you need to initialize it and set up a master password.

```sh
$ vnote init
```

### Add a New Memo

To add a new memo, use the `add` command. You'll be prompted for the master
password.

```sh
$ vnote add <key> <value>
```

- `<key>`: A unique identifier for your memo.
- `<value>`: The content of your memo.

### View a Memo

To view an existing memo, use the `view` command. You will need the master
password to decrypt the content.

```sh
$ vnote view <key>
```

- `<key>`: The key of the memo you want to view.

### List All Memos

To list all memos, use the `list` command. There are two ways to display your
memos:

#### Simple List

Displays only the keys of the memos.

```sh
$ vnote list --simple
```

#### Detailed List

Displays detailed information, including key, timestamps.

```sh
$ vnote list
```

### Delete a Memo

To delete an existing memo, use the `delete` command. You will need the master
password to perform this action.

```sh
$ vnote delete <key>
```

- `<key>`: The key of the memo you want to delete.

## Permissions Required

- `--allow-read`: Required to read configuration and memo files, such as stored
  memos and settings.
- `--allow-write`: Required to write changes to memo files, including adding,
  updating, or deleting memos.
- `--allow-env`: Required to read environment variables for configuration, such
  as determining the home directory path.

## License

This project is licensed under the MIT License.

## Contributions

Contributions are welcome! Feel free to open issues or pull requests.

## Author

Developed by takuyaw-w.
