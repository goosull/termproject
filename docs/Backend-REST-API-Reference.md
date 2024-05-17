# Drawing App Backend REST API Reference

### 1. 모든 user 정보 가져오기
모든 user 정보 가져오기는 데이터베이스에 저장되어 있는 모든 유저들의 name, passward가 
저장된 object의 배열을 가져오는 API입니다.

웹 애플리케이션의 Account 탭에서 모든 user의 리스트를 보여주기 위해 frontend가 backend 서버의
모든 user 정보 가져오기 API를 호출하면 모든 user의 name, passward등의 정보들을 저장하고 있는 object의 배열을
반환합니다.

#### Request

| ID     | URL                        | HOST                        | METHOD |
| ------ | -------------------------- | --------------------------- | ------ |
|        | /api/users                 | (임시) localhost:4000        | GET    |

---

#### Response
| Name               | Type     | Description                                  |
| ------------------ | -------- | -------------------------------------------- |
| (Response)         | Object[] | 데이터베이스에 존재하는 모든 user data object의 배열  |
| - \_id    | mongoose.Schema.Types.ObjectID   | user 식별을 한 12bytes 식별자     |
| - name             | String   | user의 이름                                   |
| - email            | String   | user의 이메일 주소                              |

---

### 2. user 정보 업데이트 하기

user 정보 업데이트 하기는 user 정보 데이터베이스에 새로운 user 추가, 기존 user 정보 update 등 
user 정보 데이터베이스를 관리하는 API 입니다.

#### 2.1. 데이터베이스에 user 정보 추가하기

데이터베이스에 새로운 user 정보를 추가하기 위해 새로 추가할 user 정보를 포함하는 object를 backend server에
전송합니다.

#### Request

| ID     | URL             | HOST                        | METHOD |
| ------ | --------------- | --------------------------- | ------ |
|        | /api/users/     | localhost:4000              | POST   |

---

#### Parameter

| Name             | Type     | Description                | Required |
| ---------------- | -------- | -------------------------- | -------- |
| user             | Object   | user 정보를 포함하는 object    | True    |
| - name             | String   | user의 이름                | True    |
| - email            | String   | user의 이메일 주소           | True     |

---

#### Response

| Name | Type   | Description                 |
| ---- | ------ | --------------------------- |
| user | Object | 생성한 user object |

#### 2.2. 기존 user 정보 수정하기

데이터베이스에 이미 존재하는 user 중 해당 id의 user 정보를 업데이트한다. 

#### Request

수정할 user의 id를 URL을 통해 전달합니다.

| ID     | URL             | HOST                        | METHOD |
| ------ | --------------- | --------------------------- | ------ |
|        | /api/users/:id     | localhost:4000           | PUT    |

---

#### Parameter

| Name             | Type     | Description                | Required |
| ---------------- | -------- | -------------------------- | -------- |
| user             | Object   | user 정보를 포함하는 object    | True    |
| - name             | String   | user의 이름                | True    |
| - email            | String   | user의 이메일 주소           | True     |

---

### Response 

| Name | Type   | Description                 |
| ---- | ------ | --------------------------- |
| user | Object | 업데이트된 user object |

---

#### 2.3. user 정보 삭제하기

데이터베이스에 존재하는 user 중 해당 id의 user 정보를 삭제한다.

#### Request

삭제할 user의 id를 URL을 통해 전달합니다.

| ID     | URL             | HOST                        | METHOD |
| ------ | --------------- | --------------------------- | ------ |
|        | /api/users/:id  | localhost:4000             | DELETE   |

---
