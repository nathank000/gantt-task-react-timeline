"use client";

import { useState } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from '@/components/EventForm';
import { IconPicker } from '@/components/IconPicker';
import * as Icons from 'react-icons/fa';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      start: new Date(),
      end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      name: 'Default Event',
      id: 'default',
      type: 'task',
      progress: 0,
      isDisabled: false,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleAddEvent = (newEvent: Task) => {
    setTasks([...tasks, newEvent]);
    setIsDialogOpen(false);
  };

  const handleUpdateEvent = (updatedEvent: Task) => {
    setTasks(tasks.map(task => task.id === updatedEvent.id ? updatedEvent : task));
    setSelectedTask(null);
    setIsDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gantt Chart Timeline</h1>
      <div className="mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedTask(null)}>New Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTask ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            </DialogHeader>
            <EventForm 
              onSubmit={selectedTask ? handleUpdateEvent : handleAddEvent} 
              initialData={selectedTask}
              onClose={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="gantt-container">
        <Gantt
          tasks={tasks}
          viewMode={ViewMode.Day}
          onSelect={handleTaskClick}
          listCellWidth=""
          columnWidth={60}
          TaskListHeader={CustomHeader}
          TaskListTable={CustomTable}
        />
      </div>
    </div>
  );
}

const CustomHeader = () => {
  return (
    <div className="gantt-table-header">
      <div className="gantt-list-header-column">Task name</div>
      <div className="gantt-list-header-column">Start</div>
      <div className="gantt-list-header-column">End</div>
      <div className="gantt-list-header-column">Icon</div>
    </div>
  );
};

const CustomTable = ({ rows, rowHeight, rowWidth, tasks }: any) => {
  return (
    <div className="gantt-table">
      {tasks.map((task: Task) => {
        const IconComponent = Icons[task.styles?.backgroundSelectedColor as keyof typeof Icons] || Icons.FaRegCircle;
        return (
          <div
            key={task.id}
            className="gantt-table-row"
            style={{ height: rowHeight, width: rowWidth }}
          >
            <div className="gantt-list-column">
              <IconComponent className="inline-block mr-2" style={{ color: task.styles?.progressColor }} />
              {task.name}
            </div>
            <div className="gantt-list-column">{task.start.toLocaleDateString()}</div>
            <div className="gantt-list-column">{task.end.toLocaleDateString()}</div>
            <div className="gantt-list-column">
              <IconPicker icon={task.styles?.backgroundSelectedColor || ''} />
            </div>
          </div>
        );
      })}
    </div>
  );
};