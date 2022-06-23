package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/timestamppb"

	"github.com/doublegrey/laggy/mining/worker/miner"
	pb "github.com/doublegrey/laggy/mining/worker/pb/worker"
)

func main() {

	for {
		worker, err := miner.FetchStats()
		if err == nil {
			// REST
			b, err := json.Marshal(worker)
			if err == nil {
				http.Post(fmt.Sprintf("https://mining.laggy.lv/api/workers/stats/%s", os.Getenv("WORKER")), "application/json", bytes.NewBuffer(b))
			}

			// gRPC
			conn, err := grpc.Dial("https://mining.laggy.lv/api/workers/stats/grpc")
			if err != nil {
				log.Fatalf("failed to connect: %v", err)
			}
			defer conn.Close()
			client := pb.NewWorkerClient(conn)

			gpus := []*pb.GPU{}
			for _, gpu := range worker.GPUs {
				gpus = append(gpus, &pb.GPU{
					Pci:            int32(gpu.PCI),
					Name:           gpu.Name,
					Load:           float32(gpu.Load),
					Chip:           int32(gpu.Chip),
					Memory:         int32(gpu.Mem),
					Hashrate:       int32(gpu.Hashrate),
					Fan:            int32(gpu.Fan),
					CoreClock:      int32(gpu.CoreClock),
					MemClock:       int32(gpu.MemClock),
					Power:          int32(gpu.Power),
					AcceptedShares: int32(gpu.AcceptedShares),
					RejectedShares: int32(gpu.RejectedShares),
				})
			}

			client.ReportStats(context.Background(), &pb.ReportStatsRequest{
				Worker: os.Getenv("WORKER"),
				Stats: &pb.Stats{
					Hashrate:     int32(worker.Hashrate),
					RunningSince: timestamppb.New(worker.RunningSince),
					Cpu:          float32(worker.CPU),
					Ram:          float32(worker.RAM),
					Storage:      float32(worker.Storage),
					Power:        int32(worker.Power),
					Gpus:         gpus,
				},
			})

		}
		time.Sleep(time.Second * 10)
	}
}
