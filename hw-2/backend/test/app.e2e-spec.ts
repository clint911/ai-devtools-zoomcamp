import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { io as ioClient, Socket } from 'socket.io-client';

describe('Application E2E Tests', () => {
  let app: INestApplication;
  let httpServer: any;
  let client1: Socket;
  let client2: Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors({
      origin: '*',
      credentials: true,
    });
    await app.init();
    await app.listen(0); // Random port
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    if (client1?.connected) client1.disconnect();
    if (client2?.connected) client2.disconnect();
  });

  describe('REST API', () => {
    it('/api/sessions (POST) should create a new session', () => {
      return request(httpServer)
        .post('/api/sessions')
        .send({ language: 'javascript' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('sessionId');
          expect(res.body).toHaveProperty('createdAt');
        });
    });

    it('/api/sessions/:id (GET) should return session details', async () => {
      // Create session first
      const createRes = await request(httpServer)
        .post('/api/sessions')
        .send({ language: 'python' });

      const sessionId = createRes.body.sessionId;

      // Get session
      return request(httpServer)
        .get(`/api/sessions/${sessionId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('sessionId', sessionId);
          expect(res.body).toHaveProperty('code');
          expect(res.body).toHaveProperty('language', 'python');
        });
    });

    it('/api/sessions/:id (GET) should return 404 for non-existent session', () => {
      return request(httpServer)
        .get('/api/sessions/nonexistent')
        .expect(404);
    });

    it('/api/sessions/:id/code (PUT) should update code', async () => {
      // Create session first with language specified
      const createRes = await request(httpServer)
        .post('/api/sessions')
        .send({ language: 'javascript' });

      const sessionId = createRes.body.sessionId;

      return request(httpServer)
        .put(`/api/sessions/${sessionId}/code`)
        .send({ code: 'console.log("test");', language: 'javascript' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
        });
    });
  });

  describe('WebSocket Collaboration', () => {
    it('should allow users to join a session', (done) => {
      const address = httpServer.address();
      const port = address.port;

      client1 = ioClient(`http://localhost:${port}`, {
        transports: ['websocket'],
      });

      client1.on('connect', () => {
        client1.emit('join-session', {
          sessionId: 'test-session',
          user: { id: 'user1', name: 'Test User 1' },
        });

        client1.on('initial-state', (state) => {
          expect(state).toHaveProperty('code');
          expect(state).toHaveProperty('language');
          expect(state).toHaveProperty('users');
          client1.disconnect();
          done();
        });
      });
    });

    it('should synchronize code changes between users', (done) => {
      const address = httpServer.address();
      const port = address.port;
      const testCode = 'console.log("Hello, World!");';

      client1 = ioClient(`http://localhost:${port}`, {
        transports: ['websocket'],
      });

      client2 = ioClient(`http://localhost:${port}`, {
        transports: ['websocket'],
      });

      let client1Ready = false;
      let client2Ready = false;

      const checkReady = () => {
        if (client1Ready && client2Ready) {
          // Client 1 changes code
          client1.emit('code-change', {
            sessionId: 'sync-test-session',
            code: testCode,
          });
        }
      };

      client1.on('connect', () => {
        client1.emit('join-session', {
          sessionId: 'sync-test-session',
          user: { id: 'user1', name: 'User 1' },
        });

        client1.on('initial-state', () => {
          client1Ready = true;
          checkReady();
        });
      });

      client2.on('connect', () => {
        client2.emit('join-session', {
          sessionId: 'sync-test-session',
          user: { id: 'user2', name: 'User 2' },
        });

        client2.on('initial-state', () => {
          client2Ready = true;
          checkReady();
        });

        // Client 2 should receive the code update
        client2.on('code-update', (code) => {
          expect(code).toBe(testCode);
          client1.disconnect();
          client2.disconnect();
          done();
        });
      });
    });

    it('should notify users when someone joins', (done) => {
      const address = httpServer.address();
      const port = address.port;

      client1 = ioClient(`http://localhost:${port}`, {
        transports: ['websocket'],
      });

      client1.on('connect', () => {
        client1.emit('join-session', {
          sessionId: 'join-test-session',
          user: { id: 'user1', name: 'First User' },
        });

        client1.on('initial-state', () => {
          // Client 1 is ready, now connect client 2
          client2 = ioClient(`http://localhost:${port}`, {
            transports: ['websocket'],
          });

          client1.on('user-joined', (user) => {
            expect(user).toHaveProperty('name', 'Second User');
            client1.disconnect();
            client2.disconnect();
            done();
          });

          client2.on('connect', () => {
            client2.emit('join-session', {
              sessionId: 'join-test-session',
              user: { id: 'user2', name: 'Second User' },
            });
          });
        });
      });
    });
  });
});
