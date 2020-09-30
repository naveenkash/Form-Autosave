import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

exports.onFormChange = functions.firestore
  .document("createdForms/{docId}")
  .onUpdate(async (change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const currentDocValue = change.after.data();

    // ...or the previous value before this update
    // const previousValue = change.before.data();

    // access a particular field as you would any JS property
    // const name = currentDocValue.name;
    let completed: number = 0;

    if (currentDocValue.firstname) {
      completed += 20;
    }
    if (currentDocValue.lastname) {
      completed += 20;
    }
    if (currentDocValue.email) {
      completed += 20;
    }
    if (currentDocValue.contact) {
      completed += 20;
    }
    if (currentDocValue.desc) {
      completed += 20;
    }

    const docId = context.params.docId;
    if (currentDocValue.completed !== completed) {
      let db = admin.firestore();
      let ref = db.collection("createdForms").doc(docId);
      await ref.update({
        completed: completed,
      });
    }
  });
