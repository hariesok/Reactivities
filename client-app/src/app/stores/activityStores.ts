import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent"
import { Activity } from "../models/activity"
import {v4 as uuid} from 'uuid'

export default class ActivityStore {
    activities: Activity[] = []
    activityRegistry = new Map<string, Activity>()
    selectedActivity: Activity | undefined = undefined
    editMode = false
    loading = false
    loadingInitial = false

    constructor() {
        makeAutoObservable(this)
    }

    loadActivities = async () => {
        this.setLoadingInitial(true)
        try {
            const activities = await agent.Activities.list()
            activities.forEach(activity => {
                activity.date = activity.date.split('T')[0]
                this.activityRegistry.set(activity.id, activity)
            })
            this.setLoadingInitial(false)
        } catch (error) {
            console.log(error)
            this.loadingInitial = false
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id)
    }

    cancelSelectActivity = () => {
        this.selectedActivity = undefined
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectActivity()
        this.editMode = true
    }

    closeForm = () => {
        this.editMode = false
    }

    //crud functions
    createActivity = async(activity: Activity) => {
        this.loading = true
        activity.id = uuid()
        try {
            await agent.Activities.create(activity)
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
                this.selectedActivity = activity
                this.editMode = false
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true
        try {
            await agent.Activities.update(activity)
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
                this.selectedActivity = activity
                this.editMode = false
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false
            })
        }
    }

    deleteActivity = async(id: string) => {
        this.loading = true
        try {
            await agent.Activities.delete(id)
            runInAction(() => {
                this.activities = [...this.activities.filter(x => x.id !== id)]
                if(this.selectedActivity?.id === id) this.cancelSelectActivity()
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false
            })
        }
    }
}