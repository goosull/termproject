# Sketch App의 서비스 요구사항 명세서
---
## 1. 문서 설명(Document Description)
---
### 1.1. 목적(Purpose)

본 문서의 목적은 개발한 Sketch App의 사용함에 있어 정상적인 작동을 정량적인 평가를 통해 검증하여, 
webOS TV 플랫폼에서 사용 가능한 스케치 앱 서비스를 위한 요구사항을 기술하는 것이다.

### 1.2. 범위(Scope)

본 문서의 범위는 제약사항(Constraints), 기능 요구사항(Functional Requirements), 
품질 요구사항(Quality Attribute)이며, 이를 설명하기 위한 시스템 컨텍스트(System context)와 용어에
대한 정의를 포함한다.

### 1.3. 용어 및 정의(Terminologies and Definitions)

- Node.JS : 구글 크롬의 자바스크립트 엔진(V8 Engine)에 기반해 만들어진 서버 사이드 플랫폼으로 
확장성이 있는 네트워크 애플리케이션 개발에 사용된다.

- Express : Node.js를 위한 웹 프레임워크의 하나로,Node.js의 핵심 모듈인 http와
Connect 컴포넌트를 기반으로 하는 웹 프레임워크다. 웹 애플리케이션, API 개발을 위해 설계되었다.

- MongoDB : MongoDB: 크로스 플랫폼 도큐먼트 지향 데이터베이스 시스템이다. NoSQL
데이터베이스로 분류되는 mongoDB는 JSON과 같은 동적 스키마형 도큐먼트들을 선호함에 따라
전통적인 테이블 기반 관계형 데이터베이스 구조의 사용을 삼간다.

- Fabric.js : Fabric.js는 Javascript HTML5 canvas library로, Canvas와 이에 대해 free drawing,
create shape, image attach 등 다양한 그리기 관련 기능을 제공한다.

## 2. 시스템 컨텍스트(System Context)
---
Sketch App은 WebOS TV 상에서 스케치, 그리기 기능과 스케치 저장,불러오기 기능을 제공한다. Sketch App은 
사용자가 그림을 그리는 canvas를 표시하고 사용자가 로그인 하여 스케치 저장, 불러오기 기능을 사용할 수 있는 frontend
서버와 사용자 정보와 스케치 정보를 전달받아 데이터베이스에 저장하고, frontend와 데이터베이스 간의 데이터의 전송 및 삭제
요청을 처리하는 기능을 담당하는 backend 서버로 분리하여 구현한다.

## 3. 요구사향(Requirements)
---
### 3.1. 기능 요구사항(functional Requirements)

### BackendServer
#### 3.1.1. Client로부터 입력받을 interface 제공
ID | Requirement | API ID | Test Case ID
--- | --- | --- | ---
FR01-1 | client로부터 유저 정보를 전달 받으면, backend 서버는 데이터베이스의 필드에 맞게 파싱한다.<br>-데이터베이스의 필드에는 다음 요소들이 포함되어야 한다<br><ul><li>_id: 유저를 구분할 고유한 ID</li><li>name: 유저의 이름</li><li>passwd: 유저의 비밀번호</li></ul> | <ul><li>BA01-2</li><li>BA01-4</li><li>BA01-5</li></ul> | <ul><li>TC01-1</li><li>TC01-2</li><li>TC01-3</li></ul>
FR01-2 | backend 서버는 필드에 맞게 파싱된 데이터를 데이터베이스에 저장한다. |  <ul><li>BA01-2</li><li>BA01-4</li><li>BA01-5</li></ul> | <ul><li>TC01-1</li><li>TC01-2</li><li>TC01-3</li></ul> 
FR01-3 | client로부터 캔버스(스케치) 정보를 전달 받으면, backend 서버는 데이터베이스의 필드에 맞게 파싱한다.<br>-데이터베이스의 필드에는 다음 요소들이 포함되어야 한다<br><ul><li>_id: 캔버스를 구분할 고유한 ID</li><li>title: 캔버스의 제목</li><li>canvas: 캔버스 정보</li><li>thumb: 캔버스 대표이미지</li><li>user: 캔버스 접근 권한을 가진 유저정보</li></ul> | <ul><li>BA02-4</li><li>BA02-5</li><li>BA02-6</li><li>BA02-7</li></ul> | <ul><li>TC02-1</li><li>TC02-2</li><li>TC02-3</li><li>TC02-4</li></ul>
FR01-4 | backend 서버는 필드에 맞게 파싱된 데이터를 데이터베이스에 저장한다. |  <ul><li>BA02-4</li><li>BA02-5</li><li>BA02-6</li><li>BA02-7</li></ul> | <ul><li>TC02-1</li><li>TC02-2</li><li>TC02-3</li><li>TC02-4</li></ul> 

#### 3.1.2. 데이터베이스의 데이터요청에 대한 처리
ID | Requirement | API ID | Test Case ID
--- | --- | --- | ---
FR02-1 | frontend 서버로부터 모든 유저의 정보을 요청받으면 backend 서버는 데이터베이스로부터 모든 유저의 정보를 frontend 서버로 전송한다. | BA01-1 | TC03-1 
FR02-2 | frontend 서버로부터 user name, passwd와 일치하는 정보가 있는지 요첩받으면 backend 서버는 데이터베이스를 검색하여 일치 여부를 frontend 서버로 전송한다. | BA01-3 | TC03-2
FR02-3 | frontend 서버로부터 특정 유저의 모든 캔버스 정보를 요청받으면 backend 서버는 데이터베이스로부터 특정 유저의 스케치를 frontend 서버로 전송한다. | BA02-1 | TC03-3
FR02-4 | frontend 서버로부터 특정 캔버스를 요청받으면 backend 서버는 해당하는 캔버스를 찾아 frontend 서버로 전송한다. | BA02-2 | TC03-4
FR02-5 | frontend 서버로부터 특정 캔버스의 대표이미지를 요청받으면 backend 서버는 해당하는 캔버스를 찾아 그 캔버스의 대표이미지를 frontend 서버로 전송한다. | BA02-3 | TC03-5

---

### Frontend Server
#### 3.1.3. 유저 정보 조회
ID | Requirement | test Case ID
--- | --- | ---
FR03-1-1 | 사용자로부터 로그인 결과를 요청받으면, frontend 서버는 backend 서버로 일치 여부 결과 데이터를 요청한다. | TC11-1

#### 3.1.4. 유저 정보 추가, 삭제 요청 처리
ID | Requirement | test Case ID
--- | --- | ---
FR03-2-1 | 사용자로부터 유저 정보 추가 요청을 받으면, frontend서버는 backend 서버로 사용자 추가 요청을한다. | TC12-1
FR03-2-2 | 사용자로부터 유저 삭제 요청을 받으면, frontend서버는 backend 서버로 사용자 삭제 요청을한다. | TC12-1

#### 3.1.5. 캔버스 정보 조회
ID | Requirement | test Case ID
--- | --- | ---
FR03-3-1 | 사용자로부터 특정 유저의 캔버스 조회 요청을 받으면, frontend 서버는 해당 사용자의 모든 캔버스 데이터를 요청한다. | TC13-1
FR03-3-2 | backend 서버로부터 캔버스 정보를 응답 받으면, frontend 서버는 화면에 캔버스 리스트 또는 캔버스를 출력한다. | TC13-1
FR03-3-3 | 사용자로부터 특정 캔버스 조회 요청을 받으면, frontend 서버는 특정 캔버스 데이터를 요청한다. | TC13-1

#### 3.1.6. 캔버스 업데이트 처리
ID | Requirement | test Case ID
--- | --- | ---
FR03-4-1 | 사용자로부터 캔버스 추가 요청을 받으면, frontend 서버는 backend 서버로 캔버스 데이터 추가 요청을 한다. | TC14-1
FR03-4-1 | 사용자로부터 캔버스 업데이트 요청을 받으면, frontend 서버는 backend 서버로 캔버스 데이터 업데이트 요청을 한다. | TC14-1
FR03-4-1 | 사용자로부터 캔버스 삭제 요청을 받으면, frontend 서버는 backend 서버로 캔버스 데이터 삭제 요청을 한다. | TC14-1

---

### 3.2. 품질 요구사향(Quality Attribute)
ID | Requirement
--- | ---
QA01 | backend 서버는 최소 10개 이상의 유저와 각 유저당 최소 10개 이상의 캔버스 데이터를 처리해야 한다.
QA02 | frontend 서버는 최소 10개 이상의 캔버스 데이터를 리스트에 표시할 수 있고 모두 편집 가능해야 한다.

### 3.3. 제약 사항(Constraint Requirement)
ID | Requirement
--- | ---
CR01 | 데이터베이스는 MongoDB를 사용한다.


