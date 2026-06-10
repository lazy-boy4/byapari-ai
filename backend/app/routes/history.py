"""Analysis-history endpoints.

The frontend identifies the user with their Firebase uid, passed as the
`user_id` query parameter. Records are scoped to that id, so a user can only
list, open, or delete their own analyses.
"""
from fastapi import APIRouter, HTTPException, Query

from app.services.history_service import delete_history, get_history, list_history

router = APIRouter(tags=["history"])


@router.get("/history")
def get_user_history(user_id: str = Query(..., description="Firebase user id")):
    try:
        return {"items": list_history(user_id)}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"History unavailable: {e}")


@router.get("/history/{history_id}")
def get_user_history_item(history_id: str, user_id: str = Query(...)):
    try:
        item = get_history(user_id, history_id)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"History unavailable: {e}")
    if item is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return item


@router.delete("/history/{history_id}")
def delete_user_history_item(history_id: str, user_id: str = Query(...)):
    try:
        ok = delete_history(user_id, history_id)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"History unavailable: {e}")
    if not ok:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {"deleted": True}
