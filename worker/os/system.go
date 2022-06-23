package os

import (
	"time"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"

	"github.com/doublegrey/laggy/mining/worker/models"
)

func FetchResources() models.SystemResources {
	mem, _ := mem.VirtualMemory()
	cpu, _ := cpu.Percent(time.Second, false)
	storagePartitions, _ := disk.Partitions(true)
	freeStorage := 0.0

	for _, p := range storagePartitions {
		device := p.Mountpoint
		s, _ := disk.Usage(device)
		if s.Total == 0 {
			continue
		}
		freeStorage += float64(s.Free)
	}
	cpuLoad := 0.0
	for _, l := range cpu {
		cpuLoad += l
	}
	return models.SystemResources{
		CPU:     cpuLoad,
		RAM:     mem.UsedPercent,
		Storage: freeStorage,
	}
}
