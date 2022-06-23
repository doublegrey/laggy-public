package miner

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os/exec"
	"time"

	"github.com/doublegrey/laggy/mining/worker/models"
	"github.com/doublegrey/laggy/mining/worker/os"
)

var Instance *exec.Cmd

func StartMiner(command string) {
	if Instance != nil {
		Instance.Process.Kill()
		Instance = nil
	}
	Instance = exec.Command(command)
	Instance.Start()
}

func CheckHealth() bool {
	resp, err := http.Get("http://80.232.252.104:22333/api/v1/status")
	return err == nil && resp.StatusCode == 200
}

func FetchStats() (models.Worker, error) {
	var request models.Worker
	resp, err := http.Get("http://80.232.252.104:22333/api/v1/status")
	if err != nil {
		return request, err
	}
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return request, err
	}
	var response models.NBMinerStats
	err = json.Unmarshal(b, &response)
	if err != nil {
		return request, err
	}

	request.GPUs = make([]models.GPU, 0)

	systemResources := os.FetchResources()

	request.RunningSince = time.Unix(int64(response.StartTime), 0)
	request.CPU = systemResources.CPU
	request.RAM = systemResources.RAM
	request.Storage = systemResources.Storage

	for _, g := range response.Miner.Devices {
		gpu := models.GPU{
			PCI:            g.PciBusID,
			Name:           g.Info,
			Load:           float64(g.CoreUtilization),
			Chip:           g.Temperature,
			Mem:            g.MemTemperature,
			Fan:            g.Fan,
			Power:          g.Power,
			Hashrate:       int(g.HashrateRaw),
			MemClock:       g.MemClock,
			CoreClock:      g.CoreClock,
			AcceptedShares: g.AcceptedShares,
			RejectedShares: g.RejectedShares,
		}
		request.Hashrate += int(g.HashrateRaw)
		request.Power += g.Power
		request.GPUs = append(request.GPUs, gpu)
	}
	return request, nil

}
