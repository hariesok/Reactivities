import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Image } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { useStore } from '../../../app/stores/store'

export default observer (function ActivityDetails() {

    const {activityStore} = useStore()
    const {selectedActivity: activity, loadActivity, loadingInitial} = activityStore
    const {id} = useParams<{id: string}>()

    useEffect(() => {
        if(id) loadActivity(id)
    }, [id, loadActivity])

    // if loadinginitial is true or we don't have an activity
    if (loadingInitial || !activity) return <LoadingComponent/> // only temporary

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            {/* <Image src={require(`../assets/categoryImages/${activity.category}.jpg`)} /> */}
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button as={Link} to={`/manage/${activity.id}`} basic color='blue' content='Edit' />
                <Button as={Link} to='/activities' basic color='grey' content='Cancel' />
            </Card.Content>
        </Card>
    )
})