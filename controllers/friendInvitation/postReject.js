const friendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandlers/updates/friends")

const postReject = async (req, res) => {
    try {
        const {id} = req.body;
        const {userId} = req.user;

        //remove that invitation from friend invitations collection
        const invitationExist = await friendInvitation.exists({_id: id})

        if(invitationExist) {
            await friendInvitation.findByIdAndDelete(id)
        }

        //update pending invitations
        friendsUpdates.updateFriendsPendingInvitations(userId);

        return res.status(200).send('Invitation successfully rejected')
    } catch (error) {
        console.log(error)
        return res.status(500).send("Please try again")
    }
    return res.send('reject handler')
}

module.exports = postReject