



const commentPostCtrls = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'comment created'
        })
    }
    catch (err) {
        res.json(err.message);
    }
}


const commentGetCtrls= (req, res) => {
    try {
        res.json({
            status: 'Succuss',
            data: 'All comment retrieved successfully'

        })
    }
    catch (err) {
        console.log(err.message);
    }
}


const uniqueGetComment = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: ' Id retrieved successfully'
        })
    }
    catch (err) {
        res.json(err.message);
    }

}

const commentUpdate = (req, res) => {
    try {
        res.json({
            status: 'Success',
            data: 'specific comment id is updated succesfully'

        })
    }
    catch (err) {
        console.log(err.message);

    }

}

const commentDelete = async (req, res) => {
    try {
        res.json({
            status: 'Succcess',
            data: 'delete comment route'
        })
    }
    catch (err) {
        res.json(err.message);
    }

}



module.exports = {
    commentPostCtrls,
    commentGetCtrls,
    uniqueGetComment,
    commentUpdate,
    commentDelete   


}