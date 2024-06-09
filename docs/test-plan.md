# Sketch App의 TEST Plan

## Backend Unit Test Cases

API | Test Name | TEST Case ID | Test Data
--- | --- | --- | ---
/api/users/ | 데이터베이스에 user 정보 추가하기 | TC01-1 | {..., data: {name: "user0", passwd: "1234", _id: "6665...", __v: 0}, ...}
/api/users/:id | user 정보 삭제하기 | TC01-2 | {data: {}, status: 201, ...}
/api/canvas/ | 새로운 canvas 저장하기 | TC02-1 | {data: CanvasObject, status: 201, ...}
/api/canvas/:id | canvas 업데이트하기 | TC02-2 | {data: CanvasObject, status: 200, ...}
/api/canvas/delete/:id | canvas 삭제하기 | TC02-3 | {data: "", status: 204, ...}
/api/users/ | 모든 user정보 가져오기 | TC03-1 | {data: UserObject\[\], status: 200, ...}
/api/users/login | 로그인 요청 | TC03-2 | {..., data: {name: "user0", ...}, status: 201, ...}
/api/canvas/ | 해당 user의 모든 canvas 불러오기 | TC03-3 | {data: CanvasObject\[\], status: 200, ...}
/api/canvas/:id | 특정 id의 canvas 불러오기 | TC03-4 | {data:{_id: "6665...", title: "test", canvas: CanvasObject, thumb: "data:image/png;base64,..."}, status:200, ...}
/api/canvas/thumb/:id | 특정 id의 canvas 대표이미지 불러오기 | TC03-5 | {data: "data:image/png;base64,iVBORw0KGgoAAAANSU...", status: 200, ...}

---
## Frontend System Test Cases

## 1. 유저 정보 조회
Test Case ID: TC11-1
Test Step | Test Data | Expected Result 
--- | --- | --- |
사용자가 Login 시도를 한다 | localhost:8080 | Login 성공시, logout, delete버튼이 표시되고, 실패하면 실패 팝업이 표시된다.

## 2. 유저 정보 추가, 삭제 요청 처리
Test Case ID: TC12-1
Test Step | Test Data | Expected Result 
--- | --- | --- |
사용자가 Add User 버튼을 클릭한다. |  localhost:8080 | 유저 추가 성공시, database에 유저가 추가되고, 실패하면 실패 팝업이 표시된다.
사용자가 Delete 버튼을 클릭한다. |   | 로그아웃처리 되고 database에 유저가 삭제되며, 해당 user의 스케치도 삭제된다.

## 3. 캔버스 정보 조회
Test Case ID: TC13-1
Test Step | Test Data | Expected Result 
--- | --- | --- |
사용자가 로그인 후, Sketch 탭에 들어간다. | localhost:8080 | 유저의 캔버스 대표이미지가 나타나고, 좌우 화살표 버튼으로 다음, 이전 캔버스를 확인할 수 있다.
사용자가 캔버스 리스트에서 캔버스를 선택한다. |  | 선택된 캔버스를 수정할 수 있는 화면이 나타난다.

## 4. 캔버스 업데이트 처리
Test Case ID: TC14-1
Test Step | Test Data | Expected Result 
--- | --- | --- |
사용자가 캔버스 추가 버튼을 누른 후 저장 버튼을 누른다. | localhost:8080 | 새로운 캔버스를 리스트에서 확인할 수 있다.
사용자가 기존 캔버스를 수정하고 저장 버튼을 누른다. |  | 업데이트된 캔버스 대표 이미지를 리스트에서 확인할 수 있다.
사용자가 캔버스 삭제 버튼을 누른다. |   | 이전 화면으로 이동되고 삭제된 캔버스를 리스트에서 확인할 수 없다.
