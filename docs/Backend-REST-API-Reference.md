# Drawing App Backend REST API Reference

### 1. User 관련 API
User 추가, 로그인, 삭제 등 유저 정보 관리를 위한 API입니다.

User Object는 다음과 같습니다.
| Name               | Type     | Description                                  |
| ------------------ | -------- | -------------------------------------------- |
| \_id    | mongoose.Schema.Types.ObjectID   | user 식별을 위한 12bytes 식별자      |
| name             | String   | user의 이름                                     |
| passwd           | String   | user의 비밀번호                                  |

#### 1.1. 모든 user 정보 가져오기
모든 user 정보 가져오기는 데이터베이스에 저장되어 있는 모든 유저들의 name, passward가 
저장된 object의 배열을 가져오는 API입니다.

웹 애플리케이션의 Account 탭에서 모든 user의 리스트를 보여주기 위해 frontend가 backend 서버의
모든 user 정보 가져오기 API를 호출하면 모든 user의 name, passward등의 정보들을 저장하고 있는 object의 배열을
반환합니다.

#### Request

| ID     | URL                        | HOST                        | METHOD |
| ------ | -------------------------- | --------------------------- | ------ |
|        | /api/users                 | localhost:4000              | GET    |

---

#### Response
| Name               | Type     | Description                                  |
| ------------------ | -------- | -------------------------------------------- |
| (Response)         | Object[] | 데이터베이스에 존재하는 모든 user data object의 배열  |
| - \_id    | mongoose.Schema.Types.ObjectID   | user 식별을 위한 12bytes 식별자    |
| - name             | String   | user의 이름                                   |
| - passwd           | String   | user의 비밀번호                                |

---

#### 1.2. 데이터베이스에 user 정보 추가하기

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
| - name           | String   | user의 이름                  | True    |
| - email          | String   | user의 이메일 주소            | True     |

---

#### Response

| Name | Type   | Description                 |
| ---- | ------ | --------------------------- |
| user | Object | 생성한 user object |

---

#### 1.3. 로그인 요청
로그인 요청은 요청받은 user name과 password와 일치하는 user 정보가 있는지 확인하고 결과를 응답합니다.

#### Request

확인할 user name과 password를 request body에 포함시켜 요청한다.

| ID     | URL              | HOST                        | METHOD |
| ------ | ---------------- | --------------------------- | ------ |
|        | /api/users/login | localhost:4000              | POST   |

---

#### Parameter

| Name             | Type     | Description                | Required |
| ---------------- | -------- | -------------------------- | -------- |
| name             | String   | 확인할 user의 name            | True    |
| passwd           | String   | 확인할 user의 password        | True    |

---

#### Response

| Status | Type / message         | Description                 |
| ------ | ---------------------- | --------------------------- |
| 400    | User not found         | 유저 정보를 찾을 수 없음          |
| 400    | Password incorrect     | password 불일치               |
| 201    | Object                 | 일치하는 user 정보              |

---

#### 1.4. 기존 user 정보 수정하기

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
| - name           | String   | user의 이름                | True    |
| - email          | String   | user의 이메일 주소           | True     |

---

### Response 

| Name | Type   | Description                 |
| ---- | ------ | --------------------------- |
| user | Object | 업데이트된 user object         |

---

#### 1.5. user 정보 삭제하기

데이터베이스에 존재하는 user 중 해당 id의 user 정보를 삭제한다. 해당 유저가 권한을 갖고 있는 모든 캔버스에서 권한이 삭제되며, 해당 유저에게만 권한이 있는 캔버스는 삭제됩니다.

#### Request

삭제할 user의 id를 URL을 통해 전달합니다.

| ID     | URL             | HOST                        | METHOD |
| ------ | --------------- | --------------------------- | ------ |
|        | /api/users/:id  | localhost:4000             | DELETE   |

---

#### Response

| Status | Type / message         | Description                 |
| ------ | ---------------------- | --------------------------- |
| 201    | Object                 | 삭제 성공시 empty object 반환   |
| 400    |                        | 삭제 실패                     |

---

### 2. Canvas(Sketch) 관련 API
데이터베이스에 저장되어있는 Canvas 데이터 관련 API 입니다.
Canvas Object는 다음과 같습니다.
| Name               | Type     | Description                                  |
| ------------------ | -------- | -------------------------------------------- |
| \_id    | mongoose.Schema.Types.ObjectID   | canvas 식별을 위한 12bytes 식별자  |
| title             | String   | canvas의 제                                  |
| canvas           | Object   | fabric.js Canvas Object                      |
| thumb            | Object   | Base64로 인코딩된 canvas의 대표이미지               |
| user             | String[] | 이 canvas에 접근 가능한 user의 id 정보              |

#### 2.1. 해당 user의 모든 canvas 불러오기

해당 user의 모든 canvas 정보 가져오기는 요청한 user가 권한을 가지고 있는 모든 canvas의 Canvas Object 배열을 가져오는 API입니다.

#### Request

| ID     | URL                        | HOST                        | METHOD |
| ------ | -------------------------- | --------------------------- | ------ |
|        | /api/canvas/               | localhost:4000              | GET    |

---

#### Parameter

| Name             | Type     | Description                    | Required |
| ---------------- | -------- | ------------------------------ | -------- |
| user             | String   | 가져올 cavnas의 권한을 갖는 user의 id| True    |

---

#### Response
| Name               | Type     | Description                                    |
| ------------------ | -------- | ---------------------------------------------- |
| (Response)         | Object[] | 데이터베이스에 존재하는 해당하는 모든 canvas object의 배열 |
| - \_id    | mongoose.Schema.Types.ObjectID   | canvas 식별을 위한 12bytes 식별자    |
| - title             | String   | canvas의 제목                                   |
| - canvas           | Object   | fabric.js Canvas Object                        |
| - thumb            | Object   | Base64로 인코딩된 canvas의 대표이미지                 |
| - user             | String[] | 이 canvas에 접근 가능한 user의 id 정보               |

---

#### 2.2. 특정 id의 canvas 불러오기
특정 id의 canvas 불러오기는 요청받은 id 값에 해당하는 canvas를 찾아서 Canvas Object를 반환하는 API 입니다.

#### Request

| ID     | URL                        | HOST                        | METHOD |
| ------ | -------------------------- | --------------------------- | ------ |
|        | /api/canvas/:id            | localhost:4000              | GET    |

---

#### Parameter

| Name             | Type     | Description                    | Required |
| ---------------- | -------- | ------------------------------ | -------- |
| id               | String   | 가져올 cavnas의 id                | True    |

---

#### Response
| Name               | Type     | Description                                  |
| ------------------ | -------- | -------------------------------------------- |
| Canvas         | Object | 해당 id의 Canvas Object                              |
| - \_id    | mongoose.Schema.Types.ObjectID   | canvas 식별을 위한 12bytes 식별자  |
| - title             | String   | canvas의 제목                                 |
| - canvas           | Object   | fabric.js Canvas Object                      |
| - thumb            | Object   | Base64로 인코딩된 canvas의 대표이미지               |
| - user             | String[] | 이 canvas에 접근 가능한 user의 id 정보             |

---

#### 2.3. 특정 id의 canvas의 대표이미지 불러오기
특정 id의 canvas의 대표이미지 불러오기 API는 요청받은 id에 해당하는 canvas를 찾고, 해당 canvas의 대표이미지를 base64 인코딩하여 반환하는 API입니다.

#### Request

canvas id를 URL 상에 표기하여 전달합니다.

| ID     | URL                        | HOST                        | METHOD |
| ------ | -------------------------- | --------------------------- | ------ |
|        | /api/canvas/thumb/:id      | localhost:4000              | GET    |

---

#### Parameter

| Name             | Type     | Description                    | Required |
| ---------------- | -------- | ------------------------------ | -------- |
| id               | String   | 대표이미지를 가져올 cavnas의 id      | True    |

---

#### Response
| Name               | Type     | Description                                  |
| ------------------ | -------- | -------------------------------------------- |
| (Response)         | String | Base64로 인코딩된 대표이미지                         |

---

#### 2.4. 새로운 canvas 저장하기
새로운 canvas 저장하기 API는 데이터베이스에 존재하지 않는 새로운 canvas를 요청받아 이를 데이터베이스에 저장하는 API입니다.

#### Request

| ID     | URL                        | HOST                        | METHOD |
| ------ | -------------------------- | --------------------------- | ------ |
|        | /api/canvas/               | localhost:4000              | POST   |

---

#### Parameter
저장할 canvas를 request body에 포함시켜 요청합니다.

| Name             | Type     | Description                    | Required |
| ---------------- | -------- | ------------------------------ | -------- |
| (Object)         | String   | 저장할 canvas의 Canvas Object     | True    |
| - \_id    | mongoose.Schema.Types.ObjectID   | canvas 식별을 위한 12bytes 식별자  |
| - title             | String   | canvas의 제목                                 |
| - canvas           | Object   | fabric.js Canvas Object                      |
| - thumb            | Object   | Base64로 인코딩된 canvas의 대표이미지               |
| - user             | String[] | 이 canvas에 접근 가능한 user의 id 정보             |

---

#### Response
| Status | Type / message         | Description                 |
| ------ | ---------------------- | --------------------------- |
| 201    | Object                 | 저장 성공, 해당 Canvas Object   |
| 400    |                        | 저장 실패                     |

---

#### 2.5. canvas 업데이트하기
canvas 업데이트하기 API는 데이터베이스에 존재하는 canvas의 id와 저장할 canvas의 Canvas Object를 요청받아 데이터베이스를 업데이트하는 API입니다.

#### Request
canvas id를 URL 상에 표기하여 전달합니다.

| ID     | URL                        | HOST                        | METHOD |
| ------ | -------------------------- | --------------------------- | ------ |
|        | /api/canvas/:id             | localhost:4000              | PUT    |

---

#### Parameter
업데이트할 canvas를 request body에 포함시켜 요청합니다.

| Name             | Type     | Description                    | Required |
| ---------------- | -------- | ------------------------------ | -------- |
| (Object)         | String   | 저장할 canvas의 Canvas Object     | True    |
| - \_id    | mongoose.Schema.Types.ObjectID   | canvas 식별을 위한 12bytes 식별자  |
| - title             | String   | canvas의 제목                                 |
| - canvas           | Object   | fabric.js Canvas Object                      |
| - thumb            | Object   | Base64로 인코딩된 canvas의 대표이미지               |
| - user             | String[] | 이 canvas에 접근 가능한 user의 id 정보             |

---

#### Response
| Status | Type / message         | Description                 |
| ------ | ---------------------- | --------------------------- |
| 201    | Object                 | 저장 성공, 해당 Canvas Object   |
| 400    |                        | 저장 실패                     |
| 404    |                        | 저장 실패, canvas 찾을 수 없음   |

---

#### 2.5. canvas 공유하기
canvas 공유하기 API는 데이터베이스에 존재하는 canvas의 id와 공유할 user의 id를 요청받아 해당 user도 canvas에 접근가능하도록 수정하는 API입니다.

#### Request

canvas id를 URL 상에 표기하여 전달합니다.
| ID     | URL                        | HOST                        | METHOD |
| ------ | -------------------------- | --------------------------- | ------ |
|        | /api/canvas/share/:id      | localhost:4000              | PUT    |

---

#### Parameter
공유할 user name을 request body에 포함시켜 요청합니다.

| Name             | Type     | Description                    | Required |
| ---------------- | -------- | ------------------------------ | -------- |
| name             | String   | 공유할 user의 name               | True    |


---

#### Response
| Name               | Type     | Description                                  |
| ------------------ | -------- | -------------------------------------------- |
| Canvas                | Object | 업데이트된 Canvas Object                       |
| - \_id    | mongoose.Schema.Types.ObjectID   | canvas 식별을 위한 12bytes 식별자  |
| - title             | String   | canvas의 제목                                 |
| - canvas           | Object   | fabric.js Canvas Object                      |
| - thumb            | Object   | Base64로 인코딩된 canvas의 대표이미지               |
| - user             | String[] | 이 canvas에 접근 가능한 user의 id 정보             |

---

#### 2.6. canvas 삭제하기

canvas 삭제하기 API는 데이터베이스에 존재하는 canvas의 id와 저장할 canvas의 Canvas Object를 요청받아 데이터베이스를 업데이트하는 API입니다.

#### Request

삭제할 canvas id를 URL 상에 표기하여 전달합니다.
| ID     | URL                        | HOST                        | METHOD |
| ------ | -------------------------- | --------------------------- | ------ |
|        | /api/canvas/delete/:id     | localhost:4000              | DELETE |

---

#### Response
| Status | Type / message         | Description                 |
| ------ | ---------------------- | --------------------------- |
| 204    |                        | 삭제 성공                     |
| 400    |                        | 삭제 실패                     |
| 404    | Canvas not found       | 삭제 실패, canvas 찾을 수 없음   |

---


