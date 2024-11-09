import bpy
import sys
import os

# 커맨드라인 인자로부터 데이터 가져오기
args = sys.argv[sys.argv.index("--") + 1:]

# 인바디 데이터
weight = float(args[0])
body_fat = float(args[1])
muscle_mass = float(args[2])
water_percentage = float(args[3])
photo_path = args[4]

# 이전 객체 삭제
bpy.ops.object.select_all(action='DESELECT')
bpy.ops.object.select_by_type(type='MESH')
bpy.ops.object.delete()

# 모델 생성 함수
def create_body_model(weight, body_fat, muscle_mass):
    body_volume = weight / 10
    radius = (body_volume / 3.14159) ** (1/3)
    height = radius * 2

    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius,
        depth=height,
        location=(0, 0, height / 2)
    )

    body = bpy.context.active_object
    body.name = 'Body'

    if body_fat > 20:
        body.active_material = bpy.data.materials.new(name="Fat Material")
        body.active_material.diffuse_color = (1, 0.6, 0.6, 1)
    else:
        body.active_material = bpy.data.materials.new(name="Muscle Material")
        body.active_material.diffuse_color = (0.6, 0.8, 1, 1)

    # 사용자 사진 텍스처 적용
    if os.path.exists(photo_path):
        img = bpy.data.images.load(photo_path)
        texture = bpy.data.textures.new("UserPhotoTexture", type='IMAGE')
        texture.image = img

        # 텍스처를 재질에 추가
        mat = bpy.data.materials.new(name="UserMaterial")
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        texImage = mat.node_tree.nodes.new('ShaderNodeTexImage')
        texImage.image = img

        mat.node_tree.links.new(bsdf.inputs['Base Color'], texImage.outputs['Color'])
        body.data.materials.append(mat)

# 모델 생성
create_body_model(weight, body_fat, muscle_mass)

# 저장 경로 설정
output_blend_path = "C:\\wannabeFit_backend\\output_model.blend"
output_obj_path = "C:\\wannabeFit_backend\\output_model.obj"

# Blender 파일 저장
bpy.ops.wm.save_as_mainfile(filepath=output_blend_path)

# 씬에 객체가 있는지 확인 후 내보내기
if len(bpy.context.selected_objects) > 0:
    # 선택된 객체가 있을 때만 내보내기
    bpy.ops.export_scene.obj(filepath=output_obj_path, use_selection=True)
else:
    print("No objects found to export.")
