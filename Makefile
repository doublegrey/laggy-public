gen:
	protoc --proto_path=proto proto/*.proto --go_out=backend --go-grpc_out=backend
	protoc --proto_path=proto proto/*.proto --go_out=worker --go-grpc_out=worker

clean:
	rm -rf backend/pb/
	rm -rf worker/pb/